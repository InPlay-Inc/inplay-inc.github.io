---
title: "Module Instruction Set"
---

# MultiConnNet Module Instruction Set
---

The MultiConnNet is Inplay's proprietary Multi-Connection Private Network system. It is a 2.4GHz wireless communication network based on a private SDR (Software Defined Radio) protocol, utilizing a one-to-many star connection topology.

The system is comprised of two primary components: the gateway module and the node module. The module is connected to the HOST via UART, and this instruction set defines the data interaction format between the module and the HOST.

The data received by the module is referred to as a **Command**, and after executing the command, the module will return a **Result**. The data actively sent by the module is called an **Event**.

Whether it is a command, result, or event, the data consists of a sequence of bytes, which are divided into two parts: header and  body. Header exists in any data packet while body varies depending on the specific command or event. 

The format of the instruction is as follows, while the data body varies depending on the specific command or event.

<br>

|Header(4bytes)|Body(viriable)|
|---|---|

*Figure 1: Data format*

<br>

|Sync Word(1byte)|ID(1byte)|Len(1byte)|
|---|---|---|

*Figure 2: Header format*

<br>

Sync Word field of header is fixed 0x4A for command and corresponding result, and 0xA4 for event.

ID field of header is the unique command or event ID.

Len field of header indicates the length of variable body that follows.

# Command Description #

## Reset(ID=1) ##

This command resets the module. The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
        <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">option</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;><font size="0">0:  Reset<br>1:  Clear configuration before reset<br>2:  Save configuration before reset</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 01 01 02                   ;Save configuration before reset
```

## Get State(ID=2) ##

This command retrieves the module status, and the length of this command is 0. The response is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
        <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">state</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;><font size="0">Current module state.<br>0:  Not running, module may not be fully configured yet<br>1:  Running</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 02 00                      ;Try retrieving module status
← 4A 02 01 01                   ;Module is running normally
```

## Get Connection(ID=3) ##

This command retrieves the connection status of the device. For the gateway, it returns the number of connected nodes and their corresponding device addresses; for nodes, a return value of 0 of number indicates not connected, while a value of 1 indicates connected.

The length of this command is 0. The response is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
        <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">number</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Number of connected devices</font></td>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">number*2</font></td>
        <td><font size="0">Device addresses of connected nodes or gateway. </font></td>        
    </tr>
</table>

*Example:*
```markdown
→ 4A 03 00                         ;Try retrieving the connection status of the device
← 4A 03 06 03 00 01 01 01 02 01    ;Gateway returns connection with 3 nodes and corresponding device address are 0x0100,0x0101,0x0102
← 4A 03 03 01 01 00                ;Node returns connection with gateway with device address 0x0001
```

## Serial Port Configuration(ID=4) ##

This command changes the serial port parameters. It is optional, meaning that if not configured, the module will use following default configurations:

- GPIO_2_1 as UART TX and GPIO_2_7 as UART RX
- 921,600 bps
- 8 bits
- No Parity
- 1 Stop bit
- Hardware flow control disabled

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">TX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Specify which GPIO is multiplexed for UART TX function. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_2, TX GPIO=0x02.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">RX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">RTS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO. If 0xFF, RTS signal is not used.</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">CTS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO. If 0xFF, CTS signal is not used</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">baud rate</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Support 921600, 460800, 230400, 115200, 57600, 38400, 19200</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">11</font></td>
        <td align="center"><font size="0">data bit</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Data bit length. 5 - 8</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">12</font></td>
        <td align="center"><font size="0">polarity</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  None<br>1:  Odd<br>2:  Even</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">13</font></td>
        <td align="center"><font size="0">stop bit</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Stop bit number</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">14</font></td>
        <td align="center"><font size="0">receive buffer size</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Receive buffer size, Maximum 2048</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">18</font></td>
        <td align="center"><font size="0">reserved</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">0x00</font></td>        
    </tr>    
</table>

*Example:*
```markdown
→ 4A 04 10 21 27 FF FF 00 C2 01 00 08 00 01 2C 01 00 00 00 ;GPIO_2_1, GPIO_2_7, 115200bps
← 4A 04 02 00 00
```

## Network Parameter Configuration(ID=5) ##

This command configure network parameters for Gateway and Node. When Gateway, the command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">gateway device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x1000 to 0xF000, where the lower 12 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">access address on connection</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when data communication after connection</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">9</font></td>
        <td align="center"><font size="0">access address on pairing</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when pairing procedure</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">13</font></td>
        <td align="center"><font size="0">channel on pairing</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Channel when pairing procedure.</font></td>
    </tr>
</table>

*Example:*
```markdown
;Device address (Gateway) is 0x1000, Access Addresses are 0x67453201 and 0xABABABAB, Channel for pairing is 37
→ 4A 05 0B 00 10 01 23 45 67 AB AB AB AB 25   
← 4A 05 02 00 00
```

When Node, the command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">node device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x0000 to 0x0FFF, where the upper 4 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">gateway device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x1000 to 0xF000, where the lower 12 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">access address on pairing</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when pairing procedure</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">11</font></td>
        <td align="center"><font size="0">channel on pairing</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Channel when pairing procedure.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">12</font></td>
        <td align="center"><font size="0">connection interval</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Node's connection interval.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">14</font></td>
        <td align="center"><font size="0">supervision timeout</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Time in millisecond, that allowed for a device to receive data or signals from another device. If no data is received within this timeframe, the connection may be considered lost or disconnected.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">18</font></td>
        <td align="center"><font size="0">pair interval</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Time interval in millisecond for sending pairing interaction information. The smaller the interval, the faster the pairing will be successful, but power consumption will increase.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">20</font></td>
        <td align="center"><font size="0">pairing duration</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Duration of pairing procedure in millisecond. 0 if non stop.</font></td>
    </tr>
</table>

*Example:*
```markdown
;Node's device address is 0x0100, access address on pairing is 0x67453201, connection interval is 800ms, supervision timeout is 20000ms, pair interval is 50ms and pairing is not stopped.
→ 4A 05 15 00 01 00 10 AB AB AB AB 25 20 03 20 4E 00 00 32 00 00 00 00 00
← 4A 05 02 00 00
```

## External Power Amplifier Control Configuration(ID=6) ##

This command sets up module's external Power Amplifier (PA) Control function. TX GPIO will automatically output high to open electronic circuits of power amplifier when RF is opened for transmission. RX GPIO and BIAS GPIO share similar working principles. 

This command is optional, meaning that if not configured, the module will by default use GPIO_3_3 and GPIO_2_5 as the TX and RX GPIOs with BIAS unused.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">TX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control Tx_En of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_3_3, it is 0x33.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">RX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control Rx_En of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_2_5, it is 0x25.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">BIAS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control bias of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. If no bias control, set it to 0xFF.</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 06 03 33 25 FF                    ;TX GPIO is GPIO_3_3, RX GPIO is GPIO_2_5, no BIAS
← 4A 06 02 00 00
```
## GPIO Input Configuration(ID=7) ##

This command configures the input functionality of the module's GPIO. When the input state is triggered, it will send an 'IO Trigger' event to the local HOST via UART or remotely send the event to connected device over the air. The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is configured as input functionality. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">internal pull up/down</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  no pull up/down<br>1:  internal pull up<br>2:  internal pull down</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">edge-triggered condition</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  falling edge<br>1:  rising edge<br>2:  both edge</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">target</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  local HOST<br>1:  remote connected device</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 07 04 04 01 00 01                    ;GPIO_0_4 falling edge trigger with internal pull up enabled, event will be remotely sent.
← 4A 07 02 00 00
```

## Run(ID=8) ##

This command start or stop running of module. If [network parameter configuration](#network-parameter-configurationid5) is not stored, it is necessary to send this command to start the module, otherwise system will automatically start running after power on reset. The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">option</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  Stop</br>1:  Start</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 08 01 01                    ;GPIO_0_4 falling edge trigger with internal pull up enabled, event will be remotely sent.
← 4A 08 02 00 00
```

## Data Transmission(ID=9) ##

This command initiates data transmission either from Gateway to Node or Node to Gateway. The module will return the result indicating that the command has been accepted and is ready to send. The actual transmission result in the air will depend on the outcome of the completion event.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Destination device address</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">data</font></td>
        <td align="center"><font size="0">Len-2</font></td>
        <td style="white-space: pre;"><font size="0">Banary byte data array</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 09 05 01 01 0A 0B 0C                    ;Send 3 bytes (0A 0B 0C) to node of 0x0101
← 4A 09 02 00 00                             ;Send data is accepted
...
← A4 66 04 01 01 00 00                       ;Transmission done event

→ 4A 09 05 00 10 0A 0B 0C                    ;Send 3 bytes to gateway of 0x1000
← 4A 09 02 00 00                             ;Send data is accepted
...
← A4 66 04 00 10 00 00                       ;Transmission done event
```

## GPIO Output(ID=10) ##

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is configured as output functionality. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">level</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">Output level.<br>0        :   Low level<br>other :  High level</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">target device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td style="white-space: pre;"><font size="0">0        :   local<br>other :  for Gateway it is remote node's device address; for Node it's not applicable. </font></td>
    </tr>
</table>


*Example:*
```markdown
→ 4A 0A 04 01 01 00 01                    ;Gateway send command to remote control Node's GPIO_0_1 output high 
← 4A 0A 02 00 00                          ;Send data is accepted
...
← A4 66 04 01 01 00 00                       ;Transmission done event

→ 4A 09 05 00 10 0A 0B 0C                    ;Send 3 bytes to gateway of 0x1000
← 4A 09 02 00 00                             ;Send data is accepted
...
← A4 66 04 00 10 00 00                       ;Transmission done event
```

# Result #

A Result is the response returned by the module, indicates whether the command sent to the module has been accepted or not. The Result is a fixed length of two bytes, following the same header as the corresponding command. The available results are as follows:

<table width="100%" border="0">
    <tr>
        <th width="25%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="60%" align="center" bgcolor="#cccccc"><font size="1">MEANING</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_NO_ERROR</font></td>
        <td align="center"><font size="0">0</font></td>
        <td><font size="0">Success</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_CMD</font></td>
        <td align="center"><font size="0">0x1001</font></td>
        <td><font size="0">Sync Word in data head error</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_CMD_ID</font></td>
        <td align="center"><font size="0">0x1002</font></td>
        <td><font size="0">ID in data head error</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_CMD_PARAM</font></td>
        <td align="center"><font size="0">0x1003</font></td>
        <td><font size="0">Parameter error</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_TIMEOUT</font></td>
        <td align="center"><font size="0">0x1004</font></td>
        <td><font size="0">Command executing timeout</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_BUSY</font></td>
        <td align="center"><font size="0">0x1005</font></td>
        <td><font size="0">Command is not acceptable due to system busy</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">WL_ERR_NOT_READY</font></td>
        <td align="center"><font size="0">0x1006</font></td>
        <td><font size="0">System is not ready of well configured</font></td>
    </tr>
</table>

# Event Description #

An Event is data actively sent by the module to the HOST. As described before, Event also includes data header with Sync Word 0xA4 and unique event identifier.

## Ready Event(ID=0x64) ##

This event indicates system is ready to accept command from HOST. It has no data body.

*Example:*
```markdown
← A4 64 00
```

## Connection Event(ID=0x65) ##

This event indicates Gateway/Node has successfully connected or disconnected to each other.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">connection</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  disconnect<br>1:  connect</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td ><font size="0">Remote device address</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 65 03 01 00 01           ;Gateway has connected with node with device address 0x0100
```

## Transmission Done Event(ID=0x66) ##

This event indicates data has been actually transmitted over the air.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td ><font size="0">Remove device address</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">result</font></td>
        <td align="center"><font size="0">2</font></td>
        <td style="white-space: pre;"><font size="0">Transmission result.<br>0        : success<br>other :  protocol-level errors</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 66 04 00 01 00 00           ;Gateway has transmitted data to node with device address 0x0100
```

## Data Reception Event(ID=0x67) ##

This event indicates data has been received from remote connected devices.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Remote device address</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">data</font></td>
        <td align="center"><font size="0">Len-2</font></td>
        <td><font size="0">Banary byte data array</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 67 05 00 01 00 01 02           ;Gateway has received 3 bytes data from node with device address 0x0100
```

## GPIO Input Trigger Event(ID=0x68) ##

This event indicates GPIO's input status is triggered, which is configured by [GPIO Input Configuration](#gpio-input-configurationid7) command. This event can be sent to local HOST or remote devices, depending on device address parameter in event data body.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">3</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Remote device address, or local if 0.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which input status is triggered. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">level</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Current GPIO level</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 68 04 01 01 04 00           ;GPIO_0_4 falling edge trigger from node with device address 0x0101
```