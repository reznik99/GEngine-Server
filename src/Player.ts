import Vector3f from "./Vector3f"

class Player {

    constructor(_name: string, _position: Vector3f, _yaw: number, _address: string, _port: number) {
        this.name = _name
        this.position = _position
        this.yaw = _yaw
        this.address = _address
        this.port = _port
    }

    // Game

    name: string

    position: Vector3f

    yaw: number

    // Networking

    address: string

    port: number
}

export default Player