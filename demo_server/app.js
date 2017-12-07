var express = require('express');
var app = express();
app.use(express.static('public'));
var server = require('http').Server(app);
var io = require('socket.io')(server);
var dgram = require('dgram');
var UDPserver = dgram.createSocket('udp6');
var f='data.csv',
    fs=require('fs');
	
var PORT = 8192;
var HOST = '';

server.listen(3000);
UDPserver.bind(PORT, HOST);
console.log("Server online at PORT 3000");

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  //console.log("Web Client Connected!");
});

UDPserver.on('listening', function () {
    var address = UDPserver.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

UDPserver.on('message', function (message, remote) {
	var clientPort = remote.port;
	var cleintAddress = remote.address;
	var msg = message.toString().split(",");
    var data = {};
	if(msg.length == 3){
		data.timestamp = Date.now();
		data.humidity = msg[0];
		data.temp = msg[1];
		data.pressure = msg[2];
		io.emit('update',data);
		var fileData = data.timestamp.toString()+","+data.humidity.toString()+","+data.temp.toString()+","+data.pressure.toString()+"\n";
		fs.appendFile(f,fileData,function(err){
			if(err){
				console.error(err);
			}
		});
	}
});

fs.writeFile(f,"TIME,HUMIDITY,TEMPERATURE,PRESSURE \n",function(err){
  if(err){
    console.error(err);
  }
  console.log("Logging to "+f+"...");
});