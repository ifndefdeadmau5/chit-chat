var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, { path : '/socket.io' });

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

io.on('connection', function(socket) {
  // this one send message to all clients except sender
  socket.broadcast.emit('hi');

  socket.on('chat message', function(msg) {
    console.log(msg);
    io.emit('chat message', msg);
  });
});

app.get('/', (req, res) => {
  res.send('Hello there');
})

http.listen(3000, '127.0.0.1');
