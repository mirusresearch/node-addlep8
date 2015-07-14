

pdu = require("./pdu.js");

// wrong username
// var pconn = new pdu.PduConnection('192.168.30.210', 'pagedge', 'pakedgep');
var pconn = new pdu.PduConnection('192.168.30.195', 'pakedge', 'pakedgep');

pdu.pshow(pconn, function(res, err) {
    debugger;
    console.log("res:", res);
    console.log("err:", err);
});
