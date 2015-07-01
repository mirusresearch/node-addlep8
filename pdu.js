var Connection = require('./connection');
var _ = require('lodash');

function Manager(ip, username, password){
	this.status = [];

	var conn = new Connection(address, username, password);

	this._update_status = function (callback){
		conn.run_command("pshow", function (response){
			var regex = new RegExp("(\\d{2}).*?\\|(.*?)\\|.*?(ON|OFF)", 'gm');

			this.status = [];
			var data = regex.exec(response);
			while(data !== null){
				this.status.push({id:data[1][1], name:data[2].trim(" "), status:data[3]});
				var data = regex.exec(response);
			}
		});
	};

	this.get_status = function(callback){
		this._update_status(function (){
			console.log(this.status);
			return callback(this.status);
		});
	};

	this.get_power = function(outlet, callback){
		this.get_status(function (status){
			var selected = _.pick(status, function (item){
				return (item.name === outlet || item.id === outlet);
			});
			callback(selected?selected.status:null);
		});
	};
	this.set_power = function(outlet, status, callback){
		var state = (status === "ON" || Number(status) === 1)?"1":"0";
		conn.run_command("pset " + outlet + " " + state, function (){
			callback(true);
		});
	};

	this.set_power_all = function(status, callback){
		this.get_status(function (){
			var state = (status === "ON" || Number(status) === 1)?"1":"0";
			_.forEach(this.status, function (outlet){
				conn.run_command("pset " + outlet.id + " " + state, function (){
				});
			}, this);
		});
	};
}

module.exports = Manager
