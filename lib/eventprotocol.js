var EventEmitter = require("events").EventEmitter,
    util         = require("util"),
    querystring  = require("querystring");

function EventProtocol(socket) {
    this.socket = socket;
};

util.inherits(EventProtocol, EventEmitter);

EventProtocol.prototype._trim = function(string) {
    return string.replace(/\s*|\s*$/, "");
};

EventProtocol.prototype.send = function(cmd) {
    this.socket.write(cmd + "\n\n");
};

EventProtocol.prototype.sendmsg = function(name, arg, uuid, lock) {
    var arg  = arg || "",
        uuid = uuid || "",
        lock = lock || false;
		
    this.socket.write("sendmsg " + uuid + "\n");
    this.socket.write("call-command: execute\n");
    this.socket.write("execute-app-name: " + name + "\n");
    if (arg) {
        this.socket.write("execute-app-arg: " + arg + "\n");				
    }
    if (lock) {
        this.socket.write("event-lock: true\n");
    }
    this.socket.write("\n\n");
};

EventProtocol.prototype.processLine = function(response, line) {
    if (line.indexOf(":") !== -1) {
        var parts = line.split(":"),
            key   = parts[0].replace(/-/g, "_"),
            value = this._trim(querystring.unescape(parts[1]));
        return response[key] = value;
    }
};

EventProtocol.prototype.processData = function(data) {
    var data     = data.toString().split("\n"),
        response = {},
        self	 = this;
    data.forEach(function(value, index) {
        self.processLine(response, value);
    });
    this.emit("processData", response);
};

module.exports = EventProtocol;