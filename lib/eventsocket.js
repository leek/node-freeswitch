var util          = require("util"),
    EventProtocol = require("./eventprotocol");

function EventSocket(socket) {
    EventSocket.super_.call(this, socket);
};

util.inherits(EventSocket, EventProtocol);

EventSocket.prototype.connect = function() {
    var self = this;
    console.log("Connecting...");
    this.send("connect");
    this.once("processData", function(response) {
        if (response.Reply_Text.indexOf("+OK") !== -1) {
            self.emit("connect");
        }
    });
};

EventSocket.prototype.answer = function() {
    console.log("Answering...");
    return this.sendmsg("answer", null, null, true);
};

EventSocket.prototype.hangup = function(reason) {
    var reason = reason || "";
    return this.sendmsg("hangup", reason, null, true);
};

EventSocket.prototype.playback = function(filename, terminators) {
    return this.sendmsg("playback", filename, null, true);
}

module.exports = EventSocket;

