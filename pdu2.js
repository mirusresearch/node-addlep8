
var TelnetConn = require('telnet-client');
var _ = require('lodash');

exports.PduConnection = function(hostname, username, password) {
    var self = this;

    self.hostname = hostname;
    self.username = username;
    self.password = password;

}

exports.run_command = function(pdu_conn, name, callback) {

    var connection = new TelnetConn();

    connection.on('timeout', function() {
        console.log("connection timeout");
    });
	connection.on('end', function() {
		console.log("connection end");
	});
	connection.on('close', function() {
		console.log("connection closing");
	});
	connection.on('error', function(error) {
		throw(error);
	});
    connection.on('ready', function(prompt) {
        console.log("connection ready. prompt = " + prompt);
        connection.exec(name, function(response) {
            callback(response);
            connection.end();
        });
    });
    connection.on('connect', function() {
        console.log("connection connect");
    });
    connection.on('writedone', function() {
        console.log("connection writedone");
    });
        
    var params = {
        host: pdu_conn.hostname,
        username: pdu_conn.username,
        password: pdu_conn.password,
        shellPrompt: "(.*)> $",
        timeout: 2000,
        loginPrompt: "enter user name:",
        passwordPrompt: "enter password",
    };
    
    connection.connect(params);
    
}

exports.pshow = function() {
    var pdu_conn = new exports.PduConnection('192.168.30.210', 'pakedge', 'pakedgep');

    exports.run_command(pdu_conn, "pshow", function(response) {
        console.log(response);
        var regex = new RegExp("(\\d{2}).*?\\|(.*?)\\|.*?(ON|OFF)", 'gm');
        var data = regex.exec(response);
        debugger;
        console.log("here");
    });
};

// exports.pshow();

exports.status_resp_to_obj = function(status_resp) {
    var status_lines = status_resp.split("\n");
    var get_header_line_arr = function(status_lines) {

    }
    for (var i = 0; i < status_lines.length; i++) {
        var line = status_lines[i];
        if (_.startsWith(line, "--")) {
            // at header border
            var header_line = status_lines[i - 1];
            var header_line_arr = _.map(header_line.split('|'), function(col_hdr, idx) {
                return {
                    massaged: col_hdr.trim().toLowerCase().replace(/ /g, "_")
                    , length: col_hdr.length
                    , raw: col_hdr
                    , location: idx
                }
            });
            return header_line_arr;
        }
        // return null;
    }
}


