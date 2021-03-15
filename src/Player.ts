import Vector3f from "./Vector3f"

class Player {

    constructor(_name: string, _position: Vector3f, _yaw: number, _address: string, _port: number, _lastSeen: number) {
        this.name = _name
        this.position = _position
        this.yaw = _yaw
        this.address = _address
        this.port = _port
        this.lastSeen = _lastSeen
    }

    // Game

    name: string

    position: Vector3f

    yaw: number

    // Networking

    address: string

    port: number

    lastSeen: number

    serialize(): string {
        return `${this.name}&${this.position.x}&${this.position.y}&${this.position.z}&${this.yaw}`
    }
}

export default Player