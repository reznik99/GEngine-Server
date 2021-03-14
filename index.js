
const Net = require('net');
const port = 8080;

const server = new Net.createServer();

// Set of all currently connected sockets
const connectedSockets = new Map();

// broadcast to all connected sockets except one
connectedSockets.broadcast = function (data, except) {
    for (const [key, value] of connectedSockets.entries()) {
        if (key !== except) {
            key.write(except.remoteAddress + ":" + except.remotePort + " " + data);
        }
    }
};

server.listen(port, "0.0.0.0", function () {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
    console.log(server.address());
});

server.on('connection', function (socket) {
    console.log("Client: " + socket.remoteAddress + ":" + socket.remotePort);
    connectedSockets.set(socket, undefined); //add user to cache

    //user passes their position, every other user receives their position
    socket.on('data', function (chunk) {
        if (chunk.toString().includes("RTT_CHECK"))
            socket.write("RTT_CHECK")
        //store user position
        connectedSockets.set(socket, socket.remoteAddress + ":" + socket.remotePort + "=" + chunk.toString());
        //broadcast to other users this user's position
        connectedSockets.broadcast(chunk, socket);
        console.log(connectedSockets.get(socket));
    });

    socket.on('end', function () {
        console.log('Closing connection with the client');
        connectedSockets.delete(socket);
        socket.end();
    });

    socket.on('error', function (err) {
        console.log(`${err}`);
        socket.end();
    });
});
