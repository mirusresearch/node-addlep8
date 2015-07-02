var telnet = require('telnet-client');
var Promise = require("bluebird");


function Connection(ip, username, password){
	this.ip = ip;
	this.username = username;
	this.password = password;

	this.run_command = function (command){

		var connection = new telnet();

		var params = {
			host: this.ip,
			username: this.username,
			password: this.password,
			shellPrompt: /(invalid username \/ password|>)/,
			// port: 23,
			timeout: 10000,
			// removeEcho: 4
			loginPrompt: "enter user name:",
			passwordPrompt: "enter password:"
		};

		return new Promise(function (resolve, reject){
			connection.on('ready', function(prompt) {
				if(prompt.indexOf("invalid username / password") !== -1){
					connection.end();
					reject("Bad username/password");
				}
				connection.exec(command, {
					shellPrompt: '(.*)> $',
					timeout : 10000,
				}, function (r){
					connection.end();
					resolve(r);
				});
			});

			connection.on('timeout', function() {
				connection.end();
				reject("Command failed, timeout exceeded");
			});

			connection.on('error', function(data) {
				connection.end();
				reject(data);
			});
			connection.connect(params);
		});
	};
}

module.exports = Connection;
