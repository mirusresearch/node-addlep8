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

#### Setting up your PDU
- First, connect both your computer and the P8 in a 192.168.1 network. Use your browser to navigate to http://192.168.1.210/, which is the P8’s web interface. Depending on how long ago you plugged in the P8, it may take about 3 minutes before the web interface is available.
- Enter the Network Setup page, where you should be able to edit the “Static IP”. Do not hit submit unless you are done changing settings, as you will be disconnected. The new IP address must have the same subnet as the RPI.
- After hitting submit, unplug the P8 from the current network and into the network containing the RPI. If you had to unplug the power to do so, remember that it will take a minute or two before the P8 is up and running again.
- You should be able to navigate to the new IP address and access the web interface again. While you are changing settings, make sure to leave ‘Enable Telnet’, in System Control, turned on, as the RPI will not be able to access it otherwise.

**If you mess up any of these steps, don’t worry!** There is a tiny reset button that may or may not set you back to the first step! I haven’t tried it, but it should be perfectly safe…
