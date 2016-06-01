//INCLUDES
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var connections = [];


//INIT
// app.use('/GET', express.static('public'));
app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){

	

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('register', function(msg){
  	console.log('User '+msg+' connected.');
  	io.emit('log_con', msg);
  	connections.push({sc:socket, name:msg});


  	var names = [];
	for(var i in connections){
		names.push(connections[i].name);
	}
	io.to(socket.id).emit('connections', names);
	names=null;
  });

  socket.on('disconnect', function(){
    var cid = -1;
    for(var i in connections){
    	if(connections[i].sc == socket){
    		io.emit('log_dc', connections[i].name);
    		cid=i;
    		break;
    	}
    }
    if(cid != -1){
    	connections.splice(cid, 1);
    }
  });
});

http.listen(3000, function(){
  console.log('Server started on port: 3000');
});