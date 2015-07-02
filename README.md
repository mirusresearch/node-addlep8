# node-addlep8
### Command the Pakedge P8 using nodejs

connection.js is the telnet wrapper. ```Connection.run_command("<args>")``` will create a telnet connection and run ```args``` on the PDU.

Use ```power.js <ip address> <args>``` to test this out

#### pdu.js

the psu manager can be required with node:

```var Manager = require('node-addlep8'); ```

then make a new Manager object. You will need the ip address, username and password for the p8 you are using:

```var pdu = new Manager('192.168.30.210', 'pagedge', 'pakedgep');```

The manager object has five public methods. Each uses standard callbacks because **_someone_** doesn't like promises yet.

**```Manager.run_command(command, callback)```**

Takes a string, `command`, and runs it on the p8. Use ```node power.js <ip_address> help``` to see a full list of commands.


**```Manager.get_status(callback)```**

Gets the status off all outlets. The default P8 will look like this:


```
[ { id: '1', name: 'Modem', status: 1 },
  { id: '2', name: 'Router', status: 1 },
  { id: '3', name: 'Switch 1', status: 1 },
  { id: '4', name: 'Switch 2', status: 1 },
  { id: '5', name: 'Aux 1', status: 1 },
  { id: '6', name: 'Aux 2', status: 1 },
  { id: '7', name: 'Aux 3', status: 1 },
  { id: '8', name: 'Aux 4', status: 1 } ]
```
  
  
**```Manager.get_power(outlet, callback)```**

Looks at outlet ```outlet``` and responds with 1 (on) or 0 (off). ```outlet``` can be an id number or the name of the outlet as a string.

**```Manager.set_power(outlet, callback)```**

Sets ```outlet```(id or name) to ```state```(1,0).

**```Manager.set_power_all(state, callback)```**

Sets all outlets to ```state```(1,0)