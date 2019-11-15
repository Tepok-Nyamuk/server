const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let roomList = []

const randomCoordinate = () => {
    let xAxis = Math.floor(Math.random() * (775 - 1)) + 1;
    let yAxis = Math.floor(Math.random() * (275 - 1)) + 1;
    let result = {xAxis, yAxis}
    // test

    return result
}

//mendengarkan semua yang connect
io.on('connection', function(socket) {
    console.log('user is connected')

    //dengerin user
    socket.on('user-login', function(username){
        console.log(username)

        // data kita terima langsung kirim kembali ke semua user
        // io.emit('dari-server', username)        
        // socket.on('create', function (room) {
        //     socket.join(room);            
            
        //   });
        socket.on('join', function(data) {
            let jumlahPlayer = 0
            for(let i =0; i<roomList.length; i++){
                if(roomList[i].name === data){
                    jumlahPlayer = roomList[i].jumlahPlayer
                }
            }

            socket.join(data);
            console.log('32', data)
            const room_length = io.sockets.adapter.rooms[data]            
            console.log('room', room_length.length)

            if(room_length.length >= jumlahPlayer) {
                
                setInterval( function() {                    
                    // io.sockets.in(room).emit('event', data);
                    io.sockets.in(data).emit('dari-server', randomCoordinate())
                }, 2000)

                //io.sockets.in(room).emit('event', data);
                console.log('roomnya', data)
                socket.in(data).on('send-score', function(score) {    
                    console.log('masuk room', data)
                    io.sockets.in(data).emit('all-score', {room: data, message: {username, score}})
                    console.log(score, username)
                })
            } else {
                console.log('kirim send loading')
                io.sockets.in(data).emit('send-loading', 'loading')
            }
        })

        socket.emit('send-roomList', roomList)
        socket.on('create', function(request) {
            let room = request.name
            let playerCount = request.player

            socket.join(room)
            roomList.push({
                name: room,
                jumlahPlayer: Number(playerCount)
            })            
            const room_length = io.sockets.adapter.rooms[room]            
            console.log('room', room_length.length)
            let jumlahPlayer = room_length.length;
            console.log(playerCount)

            if(jumlahPlayer >= playerCount) {
                
                setInterval( function() {                    
                    // io.sockets.in(room).emit('event', data);
                    io.sockets.in(room).emit('dari-server', randomCoordinate())
                }, 2000)

                //io.sockets.in(room).emit('event', data);
                console.log('roomnya', room)
                socket.in(room).on('send-score', function(score) {    
                    console.log('masuk room', room)
                    io.sockets.in(room).emit('all-score', {room: room, message: {username, score}})
                    console.log(score, username)
                })
            } else {
                console.log('kirim send loading')
                io.sockets.in(room).emit('send-loading', 'loading')
            }
          }
        );      
    })

    socket.on('send-message', function(message) {
        io.emit('message-server', {message})
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
  });