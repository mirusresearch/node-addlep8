var Connection = require('./connection');
var _ = require('lodash');
var Promise = require("bluebird");

function Manager(ip, username, password){
	this.status = [];

	var conn = new Connection(ip, username, password);

	console.log(ip, username, password);

	this._update_status = function (){
		return conn.run_command("pshow").then(function (response){
			var regex = new RegExp("(\\d{2}).*?\\|(.*?)\\|.*?(ON|OFF)", 'gm');

			this.status = [];
			var data = regex.exec(response);
			while(data !== null){
				this.status.push({id:data[1][1], name:data[2].trim(" "), status:data[3]==='ON'?1:0});
				var data = regex.exec(response);
			}
			return Promise.resolve(this.status);
		}.bind(this));
	};

	this.run_command = function (command){
		return conn.run_command(command);
	};

	this.get_status = function(callback){
		this._update_status().then(function(status){
			callback(status);
		});
	};

	this.get_power = function(outlet, callback){
		this._update_status().then(function (current_status){
			var list = _.filter(current_status, function (item){
				return (item.name == outlet || item.id == outlet);
			});
			if (list.length > 0){
				callback(null, list[0].current_status);
			}else{
				callback("No outlet with id '" + outlet + "'");
			}
		});
	};
	this.set_power = function(outlet, status, callback){
		var state = (status === "ON" || Number(status) === 1)?"1":"0";
		this._update_status().then(function (current_status){
			var outlet_id;
			try{
				outlet_id = _.filter(current_status, function (item){return (item.name == outlet || item.id == outlet)})[0].id;
			}catch(e){
				callback("Could not find outlet '" + outlet + "'");
			}
			conn.run_command("pset " + outlet_id + " " + state).then(function (response){
				callback(null, response);
			}).catch(function (error){
				callback(error);
			});
		});
	};

	this.set_power_all = function(status, callback){
		var state = (status === "ON" || Number(status) === 1)?"1":"0";

		conn.run_command("ps " + state).then(function (){
			callback();
		}).catch(function (error){
			callback(error);
		});
	};
}

module.exports = Manager;
