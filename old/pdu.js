var Connection = require('./connection');
var _ = require('lodash');
var Promise = require("bluebird");

function Manager(ip, username, password){
	this.status = [];

	var conn = new Connection(ip, username, password);

	// maintain a list of the outlet ids, names, and on/off state.
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

	// call the connection object.
	this.run_command = function (command, callback){
		return conn.run_command(command).then(function(){
			callback(null,null);
		}).catch(callback);
	};

	// get the status object generated by _update_status
	this.get_status = function(callback){
		this._update_status().then(function(status){
			callback(null, status);
		}).catch(callback);
	};

	// get the on/off state of the specified outlet. You can supply the name of outlet or the id number. Result will be 1/0 (on/off)
	this.get_power = function(outlet, callback){
		this._update_status().then(function (current_status){
			var list = _.filter(current_status, function (item){
				return (item.name == outlet || item.id == outlet);
			});
			if (list.length > 0){
				callback(null, list[0].current_status);
			}else{
				callback(new Error("No outlet with id '" + outlet + "'"));
			}
		});
	};

	// set <outlet> to <state (1/0)>
	this.set_power = function(outlet, state, callback){
		var power_state = (state === "ON" || Number(state) === 1)?"1":"0";
		this._update_status().then(function (current_status){
			var outlet_id;
			try{
				outlet_id = _.filter(current_status, function (item){return (item.name == outlet || item.id == outlet)})[0].id;
			}catch(e){
				callback("Could not find outlet '" + outlet + "'");
			}
			var command = "pset " + outlet_id + " " + power_state;
			conn.run_command(command).then(function (){
				callback();
			}).catch(function (error){
				callback(error);
			});
		});
	};

	// set all outlets to <state (1/0)>
	this.set_power_all = function(state, callback){
		var power_state = (state === "ON" || Number(state) === 1)?"1":"0";

		conn.run_command("ps " + power_state).then(function (){
			callback();
		}).catch(function (error){
			callback(error);
		});
	};
}

module.exports = Manager;