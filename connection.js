var telnet = require('telnet-client');
var Promise = require("bluebird");


function Connection(ip, username, password){

	var self = this;

	self.ip = ip;
	self.username = username;
	self.password = password;

	var initial_delay = 100; //ms
	var max_delay = 5000;
	var reconnect_delay = 5000;

	this.connection = new telnet();

	var params = {
		host: self.ip,
		username: self.username,
		password: self.password,
		shellPrompt: /(invalid username \/ password|>)/,
		// port: 23,
		timeout: 2000,
		// removeEcho: 4
		loginPrompt: "enter user name:",
		passwordPrompt: "enter password:"
	};

	this.connected = false;
	this.disconnect_handle = undefined;
	this.disconnect_time = 3000; // ms

	self.connection.on('timeout', function() {
		// console.log("timeout");
		self.connected=false;
		self.connection.end();
	});
	self.connection.on('end', function() {
		// console.log("ending");
		self.connected=false;
	});
	self.connection.on('close', function() {
		// console.log("closing");
		self.connected=false;
	});
	self.connection.on('error', function(error) {
		self.connected=false;
		// console.log(error);
		throw(error);
	});


	this.command_queue = [];
	this.proccessing = false;

	var proccess_next = function (){
		if (self.command_queue.length > 0){
			self.proccessing = true;
			var command = self.command_queue.shift();

			self.run_command(command.command).then(function (data){
				command.callback(null, data);
			}).catch(function (error){
				command.callback(error, null);
			}).finally(function (){
				if(self.command_queue.length > 0){
					proccess_next(); //how could this go wrong?
				}else{
					self.proccessing = false;
				}
			});
		}
	};


	this.queue = function (command){
		return new Promise(function (resolve, reject){

			var callback = function (err, data){
				if(err){
					reject(err);
				}else{
					resolve(data);
				}
			};

			self.command_queue.push({command:command, callback:callback});
			if(!self.proccessing){
				proccess_next();
			}
		});
	}.bind(self);

	this.close_connection = function (){
		if(self.connected){
			self.connection.end();
			self.connected = false;
		}
	};

	this.run_command = function (command){
		self.reconnect_delay = self.initial_delay;
		clearTimeout(self.disconnect_handle);
		self.disconnect_handle = setTimeout(self.close_connection, self.disconnect_time);

		return new Promise(function (resolve, reject){
			var proccess_command = function (prompt){
				self.connection.exec(command, {
					shellPrompt: '(.*)> $',
					timeout : 6000,
				}, function (r){
					resolve(r);
				});
			};

			if(!self.connected)
			{
				var connect = function (){
					self.connection.once('ready', function (prompt){
						if(prompt.indexOf("invalid username / password") !== -1){
							self.connection.end();
							reject(new Error("Bad username/password"));
						}else{
							self.connected=true;
							proccess_command();
						}
					});
					self.connection.once('error', function (error){
						reconnect_delay = Math.min(reconnect_delay *= 1.4, max_delay);
						setTimeout(function (){
							connect();
						}, reconnect_delay);
					});
					self.connection.connect(params);
				};
				connect();
			}
			else{
				proccess_command();
			}
		});
	};
	var close_connection = self.close_connection;
}

module.exports = Connection;
