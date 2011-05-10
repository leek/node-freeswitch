var net = require('net'),
querystring = require('querystring'),
EventSocket = require('./index');

var server = net.createServer(function (socket) {
	
    // onConnect
    socket.on("connect", function () {
        var self = this;
        console.log("Socket Connected!");
        console.log("Current connections: %d\n", server.connections);
	
        this.eventsocket = new EventSocket(socket);
		
        this.eventsocket.connect();
        this.eventsocket.on("connect", function(response){
            console.log("Connected to FreeSWITCH!");
            self.answer();
            self.playback("/usr/local/freeswitch/sounds/en/us/callie/ivr/8000/ivr-welcome_to_freeswitch.wav");
        });
    })
	
    // onData
    socket.on("data", function (data) {
        this.eventsocket.processData(data);
    });
	
    // onClose
    socket.on("close", function (had_error) {
        socket.end();
        console.log("Closed\n");
        console.log("--------------------------------------------\n");
    });

});

server.listen(8084, "127.0.0.1", function () {
    address = server.address();
    console.log("Server started listening on %s:%d\n", address.address, address.port);
});