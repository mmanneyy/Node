require('dotenv').config({quiet:true});
const PORT = process.env.PORT;
const net = require('net');
const clientsQueue = new Map();
const MAX_CLIENTS = 10;
let i = 0;
const broadcast = (client, message) => {
    for(let [id, socket] of clientsQueue) {
        if(socket !== client) {
            socket.write(message)
        }
    }
}

const unicast = (receiver, message) => {
    if(clientsQueue.has(receiver)) {
        const socket = clientsQueue.get(receiver)
        if(!socket) throw new Error(`User ${receiver} does not exist`);
        socket.write(message);
    }
}
const server = net.createServer((socket) => {
    let userId = i++;
    socket.id = userId;
    clientsQueue.set(socket.id, socket);
    broadcast(socket, `${socket.id} joined the chat. Say hello`);
    socket.on('data', (message) => {
        if(message.toString().startsWith('/pm ')) {
            const str = message.toString().slice(4);
            const spaceIdx = str.indexOf(' ');
            const receiver = Number(str.slice(0, spaceIdx));
            const msg = str.slice(spaceIdx + 1);
            if (!clientsQueue.has(receiver)) {
                socket.write(`User ${receiver} does not exist\n`);
                return;
            }
            unicast(receiver, `${socket.id}: ${msg}`);
        } else {
        broadcast(socket, `${socket.id}: ${message}`);
        }
    });
    socket.on('end', () => {
        broadcast(socket, `User ${socket.id} left the chat`);
        clientsQueue.delete(socket.id);
    });
    if(clientsQueue.size === MAX_CLIENTS) {
        socket.write("Server is full");
        socket.end();
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

