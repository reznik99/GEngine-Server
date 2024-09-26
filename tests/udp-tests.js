const dgram = require('dgram');
const client = dgram.createSocket('udp4');


client.on('message', (chunk, rinfo) => {
    console.log(chunk.toString())
})

console.log("Testing Lobby Join")
const joinMessage = "CONNECT&0.0&0.0&0.0&0.0&Frank"
client.send(joinMessage, 0, joinMessage.length, 9998, 'localhost', function (error) {
    if (error) {
        client.close();
    } else {
        console.log('Data sent !!!');
    }
});
console.log("Testing Lobby Update")
const updateMessage = "UPDATE&10.1234&10.1234&10.1234&257.3423"
client.send(updateMessage, 0, updateMessage.length, 9998, 'localhost', function (error) {
    if (error) {
        client.close();
    } else {
        console.log('Data sent !!!');
    }
});
console.log("Testing Lobby RTT")
const RTTMessage = "RTT_CHECK"
// client.send(RTTMessage, 0, RTTMessage.length, 9998, 'localhost', errHandler);
client.send(RTTMessage, 9998, 'localhost', function (error) {
    if (error) {
        client.close();
    } else {
        console.log('Data sent !!!');
    }
});

//client.close()