

pdu = require("./pdu.js");
_ = require('lodash');

var pconn = new pdu.PduConnection('192.168.30.195', 'pakedge', 'pakedgep');
// wrong username
// var pconn = new pdu.PduConnection('192.168.30.195', 'pagedge', 'pakedgep');
// wrong ip
// var pconn = new pdu.PduConnection('192.168.30.1', 'pakedge', 'pakedgep');


var log_func_creator = function(num) {
    return function(res, err) {
        // console.log("res" + num + ":", res);
        if (err == null && res != null) {
            // console.log("success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! " + num);
        } else {
            // console.log("success" + num + ":", res != null);
            console.log("err" + num + ":", err);
        }
    };
};

// pdu.pshow(pconn, log_func_creator(1));

// _.delay(pdu.pshow, 500, pconn, log_func_creator(2));



for (var i = 0; i < 1400; i++) {
    pdu.pshow(pconn, log_func_creator(i + 1));
}
