const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)



//mendengarkan semua yang connect
io.on('connection', function(socket) {
    console.log('user is connected')

    //dengerin user
    socket.on('user-login', function(username){
        console.log(username)

        // data kita terima langsung kirim kembali ke semua user
        // io.emit('dari-server', username)
        // setInterval( function() {
        //     // io.sockets.in(room).emit('event', data);
        //     io.emit('dari-server', 'username')
        // }, 3000)
        // socket.on('create', function (room) {
        //     socket.join(room);            
            
        //   });

        socket.on('create', function(room) {
            socket.join(room);
            //io.sockets.in(room).emit('event', data);
            console.log('roomnya', room)
            socket.in(room).on('send-score', function(score) {
                console.log('32')
                console.log('masuk room', room)
                io.sockets.in(room).emit('all-score', {room: room, message: {username, score}})
                console.log(score, username)
            })
          }
        );
        // socket.on('send-score', function(score) {
        //     io.emit('all-score', {username, score})
        //     console.log(score, username)
        // })
        
        
    })

    socket.on('send-message', function(message) {
        io.emit('message-server', {message})
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
  });