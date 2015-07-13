var Manager = require('./pdu');

var pdu = new Manager('192.168.30.210', 'pakedge', 'pakedgep');

pdu.get_status(function (error, data){
    console.log("data:", data)
	if (error){
		console.log(error);
	}else{
		console.log(data);
	}
});

pdu.set_power('1', 0, function (error, data){
	if (error){
		console.log(error);
	}else{
		console.log(data);
	}
});

pdu.set_power('1', 1, function (error, data){
	if (error){
		console.log(error);
	}else{
		console.log(data);
	}
});

pdu.set_power('1', 0, function (error, data){
	if (error){
		console.log(error);
	}else{
		console.log(data);
	}
});
