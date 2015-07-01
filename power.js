#!/usr/bin/env node
// usage:
// node power.js <ip address> <command>
// where <command> is any valid P8 telnet api command.
var Connection = require('./connection');

var arg = process.argv.slice(3).join(" ");
var address = process.argv[2];

var conn = new Connection(address, "pakedge", "pakedgep");

conn.run_command(arg, function (r){
	console.log(r);
});