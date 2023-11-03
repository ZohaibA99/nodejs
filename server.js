const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 5050, function () {
    console.log('server running on port: 5050')
})

app.use(express.static(__dirname + '/public'))

const users = {};

io.sockets.on('connection', (client) => {
    const broadcast = (event, data) => {
        client.emit(event, data);
        client.broadcast.emit(event, data);
    }

    broadcast('user', users)

    client.on('message', (message) => {
        if(users[client.id] !== message.name){
            users[client.id] = message.name;
            broadcast('message', message)
        }
        broadcast('message', message)
    })

    client.on('disconnect', () => {
        delete users[client.id];
        client.broadcast.emit('user', users);
    })
})