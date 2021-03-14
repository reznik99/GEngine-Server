import dgram from 'dgram'
import Vector3f from "./Vector3f"
import Player from "./Player"

const server = dgram.createSocket('udp4')
const TICKRATE = 30
const players: Map<String, Player> = new Map()

server.on('message', (chunk, rinfo) => {
    // console.log(chunk.toString())
    let values: string[] = chunk.toString().split("&")

    if (values[0].startsWith("CONNECT")) {
        // Player connect
        console.info("Player joined")

        if (values.length != 6) {
            console.error(`Invalid CONNECT, params length ${values.length}`)
            return
        }
        let name: string = values[5]
        let position: Vector3f = new Vector3f(Number(values[1]), Number(values[2]), Number(values[3]))
        let yaw: number = Number(values[4])

        let newPlayer: Player = new Player(name, position, yaw, rinfo.address, rinfo.port)

        players.set(rinfo.address + ":" + rinfo.port, newPlayer)

    } else if (values[0].startsWith("UPDATE")) {
        // Player update
        // console.info("Player update")
        let player: Player = players.get(rinfo.address + ":" + rinfo.port)
        if (values.length != 5 || player == null) {
            console.error("Invalid UPDATE")
            return
        }
        player.position = new Vector3f(Number(values[1]), Number(values[2]), Number(values[3]))
        player.yaw = Number(values[4])


    } else if (values[0].startsWith("RTT_CHECK")) {
        // Player check RTT
        console.info("Player RTT Check")
        let time: string = new Date().getTime().toString()
        server.send(time, rinfo.port, rinfo.address)
    } else {
        console.error("Invalid formatted data recieved: " + chunk.toString())
    }
})

server.on('listening', () => {
    const address = server.address()
    console.log(`server listening ${address.address}:${address.port}`)
})

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`)
    server.close()
})

server.bind(9998)

setInterval(broadcastPlayerData, 1000 / TICKRATE)


function broadcastPlayerData() {
    // console.info(`Players online ${players.size}`)
    players.forEach((player: Player, name: string) => {
        broadcast(player, name)
    })
}

// Send one player's info to all other players
function broadcast(playerInfo: Player, name: string) {
    players.forEach((player: Player, ip: string) => {
        if (ip !== name) {
            let data: string = `${playerInfo.name}&${playerInfo.position.x}&${playerInfo.position.y}&${playerInfo.position.z}&${playerInfo.yaw}`
            server.send(data, player.port, player.address)
        }
    })
}