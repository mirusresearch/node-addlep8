

pdu = require("./pdu.js");

// wrong username
// var pconn = new pdu.PduConnection('192.168.30.210', 'pagedge', 'pakedgep');
var pconn = new pdu.PduConnection('192.168.30.195', 'pakedge', 'pakedgep');

pdu.pshow(pconn, function(res, err) {
    // debugger;
    console.log("res1:", res);
    console.log("err1:", err);
});

pdu.pshow(pconn, function(res, err) {
    console.log("res2:", res);
    console.log("err2:", err);
});

pdu.pshow(pconn, function(res, err) {
    console.log("res3:", res);
    console.log("err3:", err);
});

pdu.pshow(pconn, function(res, err) {
    console.log("res4:", res);
    console.log("err4:", err);
});
