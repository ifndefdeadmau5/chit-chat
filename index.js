var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(3333, function() {
  console.log('listening on *:3333');
});

// Chatroom
var numUsers = 0;

io.on('connection', socket => {
  var addedUser = false;

  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('join', function({ username, room }) {
    console.log(username, ' joined')
    socket.join(room);

    setInterval(() => {
      io.to('Default').emit('new message', 'come on');  
    }, 1000)
  });
  
  // when the client emits 'new message', this listens and executes
  socket.on('new room message', ({ room, message }) => {
    console.log('Got new message')
    console.log(room)
    console.log(message)
    io.to(room).emit('new room message', { username: socket.username, message });
  })
  // when the client emits 'add user', this listens and executes
  socket.on('add user', username => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username,
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});
