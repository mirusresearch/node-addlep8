
var pdu = require("../pdu.js");

exports.test_status_response = function(test) {


    var sample_resp_arr = [
        "************************************************************",
        "*                                                          *",
        "*                                                          *",
        "*     Power Outlet Port Parameters and Status              *",
        "*                                                          *",
        "*                                                          *",
        "************************************************************",
        ">",
        ">",
        "",
        "Port |       Name | status | Reserved By |   Timer   | AutoPing",
        "-----+------------+--------+-------------+-----------|---------",
        "  01 |      Modem |     ON |        Open |       OFF |    OFF",
        "  02 |     Router |     ON |        Open |       OFF |    OFF",
        "  03 |   Switch 1 |     ON |        Open |       OFF |    OFF",
        "  04 |   Switch 2 |     ON |        Open |       OFF |    OFF",
        "  05 |      Aux 1 |     ON |        Open |       OFF |    OFF",
        "  06 |      Aux 2 |     ON |        Open |       OFF |    OFF",
        "  07 |      Aux 3 |     ON |        Open |       OFF |    OFF",
        "  08 |      Aux 4 |     ON |        Open |       OFF |    OFF"
    ];
    var sample_resp = sample_resp_arr.join("\n");

    // console.log(pdu.status_resp_to_obj(sample_resp));
    var status_resp = pdu.status_resp_to_obj(sample_resp);
    console.log("status_resp:", status_resp);

    test.ok(status_resp.length == 8);

    var fstatus = status_resp[0];
    test.ok(fstatus.port === '01');
    test.ok(fstatus.name === 'Modem');
    test.ok(fstatus.status === 'ON');
    test.ok(fstatus.reserved_by === 'Open');
    test.ok(fstatus.timer === 'OFF');
    test.ok(fstatus.autoping === 'OFF');

    test.done();


};

// exports.test_status_response(null);
