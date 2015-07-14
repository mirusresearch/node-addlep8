
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
        // var regex = new RegExp("(\\d{2}).*?\\|(.*?)\\|.*?(ON|OFF)", 'gm');
        // var data = regex.exec(response);
        // console.log("here");
        console.log(exports.status_resp_to_obj(response));
    });
};

// exports.pshow();

exports.status_resp_to_obj = function(status_resp) {
    var status_lines = _.filter(status_resp.split("\n"), function(line) {
        return !_.startsWith(line, "*") &&
            line.length > 0 &&
            !_.startsWith(line, ">");
    });
    var get_header_line_location = function(status_lines) {
        for (var i = 0; i < status_lines.length; i++) {
            var line = status_lines[i]
            if (_.startsWith(line, "--")) {
                return i - 1;
            }
        }
        throw "Header line not found";
    };
    // console.log("status_lines:", status_lines);
    var get_column_info_arr = function(header_line) {
        return _.map(header_line.split('|'), function(col_hdr, idx) {
            return {
                massaged: col_hdr.trim().toLowerCase().replace(/ /g, "_")
                , length: col_hdr.length
                , raw: col_hdr
                , location: idx
            }
        });
        // return header_line_arr;
    }
    var header_line_location = get_header_line_location(status_lines);
    var column_info_array = get_column_info_arr(status_lines[header_line_location]);
    status_lines.splice(header_line_location, 2);

    // console.log("remaining_status_lines:", status_lines);

    var header_obj = {};
    for (var i = 0; i < column_info_array.length; i++) {
        // debugger;
        column_obj = column_info_array[i];
        header_obj[column_obj.location] = _.omit(column_obj, 'location');
    }
    // console.log("header_obj:", header_obj);

    status_res = []
    for (var i = 0; i < status_lines.length; i++) {
        var line = status_lines[i];
        var status_obj = {};
        var last_end = 0;
        for (var j = 0; j < _.keys(header_obj).length; j++) {
            // console.log("last_end:", last_end);
            var hdr_col = header_obj[j.toString()];
            // console.log("hdr_col:", hdr_col);
            // console.log("substring from " + last_end + " to " + 
            var col_val = line.substr(last_end, hdr_col.length);
            // console.log("col_val:", col_val);
            status_obj[hdr_col.massaged] = col_val.trim();
            last_end += hdr_col.length + 1;
        }
        status_res.push(status_obj);
    }

    // console.log("status_res:", status_res);
    return status_res;
}


