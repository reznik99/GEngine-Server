import dgram from 'dgram';
const server = dgram.createSocket('udp4');

const players: Map<String, Player> = new Map()

server.on('message', (chunk, rinfo) => {
    let data: string = chunk.toString()
    let values: string[] = data.split("&")

    if (values[0].startsWith("CONNECT")) {
        // Player connect
        let name: string = values[5]
        let position: Vector3f = new Vector3f(Number(values[1]), Number(values[2]), Number(values[3]))
        let yaw: number = Number(values[4])

        let newPlayer: Player = new Player(name, position, yaw, rinfo.address, rinfo.port)

        players.set(rinfo.address + ":" + rinfo.port, newPlayer)

    } else if (values[0].startsWith("UPDATE")) {
        // Player update

    } else if (values[0].startsWith("RTT_CHECK")) {
        // Player check RTT
        let time: string = new Date().getTime().toString();
        server.send(time, rinfo.port, rinfo.address);
    }

    server.send(chunk.toString(), rinfo.port, rinfo.address, (err) => {
        console.log(`server sent: ${chunk.toString()} to ${rinfo.address}:${rinfo.port}`);
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.bind(9998);