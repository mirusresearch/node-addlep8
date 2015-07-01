# node-addlep8
### Command the Pakedge P8 using nodejs

connection.js is the telnet wrapper. ```Connection.run_command("<args>")``` will create a telnet connection and run ```args``` on the PDU.

Use ```power.js <ip address> <args>``` to test this out

pdu.js will wrap connection.js and contain convenience functions, like checking and setting power states for each outlet, etc..
