var Manager = require('./pdu');

var pdu = new Manager('192.168.30.210', 'pakedge', 'pakedgep');

pdu.get_status(function (error, data){
	if (error){
		console.log(error);
	}else{
		console.log(data);
	}
});