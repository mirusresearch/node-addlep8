// usage:
// node power.js <command>
// where <command> is any valid P8 telnet api command.
var Connection = require('./connection');

var arg = process.argv.slice(2).join(" ");

var conn = new Connection('192.168.1.210', "pakedge", "pakedgep");

conn.run_command(arg, function (r){
	console.log(r);
});