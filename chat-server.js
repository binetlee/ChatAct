//Determine the port on which the server will run
var io = require('socket.io')(2196);

//ID for socket.io
io.on('connection', function(socket){

    //execute on server start
    //add user to room notification
    socket.on('join:room', function(data){
        var room_name = data.room_name;
        socket.join(room_name);
    });

    //list user name of departed
    //emit exit message
    //given current room
    socket.on('leave:room', function(msg){
        msg.text = msg.user + " has left the room";
        socket.in(msg.room).emit('exit', msg);
        socket.leave(msg.room);
    });

    //listen for messages in the client
    socket.on('send:message', function(msg){
        socket.in(msg.room).emit('message', msg);
    });

});