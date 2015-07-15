// var uuid = require('uuid');
var TelnetConn = require('telnet-client');
var _ = require('lodash');
// var NEXT_CMD_DELAY = 1000; // 1 second between commands

exports.PduConnection = function(hostname, username, password) {
    var self = this;

    self.hostname = hostname;
    self.username = username;
    self.password = password;

    self.cmd_queue = [];
    self.NEXT_CMD_DELAY = 2000; // in ms
    self.last_cmd_time = null;

    self.add_cmd = function(func) {
        self.cmd_queue.push(func);
        var now = new Date();
        var since_last = now - self.last_cmd_time;
        var cmd_delay = self.NEXT_CMD_DELAY - since_last;
        cmd_delay = (cmd_delay > 0) ? cmd_delay : 0;
        if (self.cmd_queue[0] === func) {
            // console.log("command added, and none before it.  running it. delay = " + cmd_delay);
            setTimeout(func, cmd_delay);
        }
    };
    self.cmd_done = function() {
        self.last_cmd_time = new Date();
        self.cmd_queue.shift();
        if (self.cmd_queue.length > 0) {
            // console.log("calling next command, delay = " + self.NEXT_CMD_DELAY);
            setTimeout(self.cmd_queue[0], self.NEXT_CMD_DELAY); // delay 1 sec between commands
        }
    };
}

exports.run_command = function(pdu_conn, name, callback) {

    var the_func = function() {
        var connection = new TelnetConn();

        connection.on('timeout', function() {
            console.log("connection timeout");
            callback(null, "timeout (possible bad login creds)");
            connection.destroy();
        });
        // connection.on('end', function() {
        //     console.log("connection end");
        // });
        connection.on('close', function() {
            // console.log("connection closed");
            pdu_conn.cmd_done();
        });
        connection.on('error', function(error) {
            callback(null, error);
        });
        connection.on('ready', function(prompt) {
            // console.log("connection ready. prompt = " + prompt);
            connection.exec(name, function(response) {
                callback(response, null);
                connection.end();
            });
        });
        // connection.on('connect', function() {
        //     console.log("connection connect");
        // });
        // connection.on('writedone', function() {
        //     console.log("connection writedone");
        // });

        var params = {
            host: pdu_conn.hostname,
            username: pdu_conn.username,
            password: pdu_conn.password,
            shellPrompt: "(.*)> $",
            timeout: 40, // app. 3 seconds - not sure why, maybe units are tenths of seconds. also this figure doesn't seem constant.
            loginPrompt: "enter user name:",
            passwordPrompt: "enter password",
        };

        connection.connect(params);
    };
    pdu_conn.add_cmd(the_func);
    
}

exports.pshow = function(pdu_conn, callback) {
    exports.run_command(pdu_conn, "pshow", function(response, error) {
        callback(exports.status_resp_to_obj(response), error);
    });
};

// exports.pshow();

exports.status_resp_to_obj = function(status_resp) {
    if (status_resp == null) {
        return null;
    }
    // debugger;
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


