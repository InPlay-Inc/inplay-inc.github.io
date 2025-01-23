---
title: "Module Instruction Set"
---

# MultiConnNet Module Instruction Set
---

The MultiConnNet is Inplay's proprietary Multi-Connection Private Network system. It is a 2.4GHz wireless communication network based on a private SDR 
(Software Defined Radio) protocol, utilizing a one-to-many star connection topology.

The system is comprised of two primary components: the **Gateway** module and the **Node** module. The module is connected to the HOST via UART interface, and this instruction set defines the data packet format between the module and the HOST.

The data packet originally issued by HOST is called **Command** and the module will return **Response** to HOST accordingly. The data packet 
originally issued by the module is called **Event**.

# Command and Response

Command and corresponding Response are data packets consist of a sequence of bytes. The format of the data packet is as follows.

<br>

|Sync Word|ID|Owner|Body Len|Body|
|---|---|---|---|---|
|(1 byte)|(1 byte)|(2 bytes)|(2 bytes)|(variable)|

*Figure 1: Command and response data packet format*

<br>

- **Sync Word:** Fixed 0x4A for command and corresponding response.

- **ID:**  unique command id.

- **Owner:** Represents who will actually excute the command or who send it for response. 0 represents local module, otherwise remote module's device address.

- **Body Len:** is the length of variable body that follows.

Command can be executed by local module or remote module. If command is executed locally (***Owner*** in command data packet is 0), the receiver module will send back a response data packet to the HOST immediately, indicating the result of execution. This response is referred to as ***Local Response*** (Owner is 0 in response data packet). If command is executed remotely (***Owner*** in command data packet is non-zero), the receiver module will send back local response immediately, indicating whether the command is accepted or not. If accepted, a subsequent [Transmission Done Event](#transmission-done-event-id0x66) is then received by HOST indicates the command is actually passed-through to the remote module. If the result of transmission is success, additional response data packet from the remote module will then be forwarded back to the HOST. Since ***Owner*** field is actual device address (non-zero) in this response, it is referred to as ***Remote Response***.

Commands that execute remotely are only issued to gateway module. For node module, all commands are local command so that ***Owner*** field is ignored.

Configuration commands are those that must be sent at least once by HOST prior to other commands. Parameters by configuration command can be stored in flash so that system can automatically start running each time power on reset, without configuration command being issue again. Configuration command are local command only.

[Data Transmission](#data-transmission-id9) command is the only remote command that ***Remote Response*** is not generated since data is totally passed-through to HOST and completely user dependent.

Here are details of MultiConnNet commands and corresponding responses:

## Serial Port Configuration (ID=1)

This command changes parameters of the serial port that interacts with HOST. It is for local only. It is optional, meaning that if not configured, the module will use following default UART configurations:

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
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">TX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Specify which GPIO is multiplexed for UART TX function. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_2, TX GPIO=0x02.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">RX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">RTS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO. If 0xFF, RTS signal is not used.</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">CTS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Same as TX GPIO. If 0xFF, CTS signal is not used</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">8</font></td>
        <td align="center"><font size="0">baud rate</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Support 921600, 460800, 230400, 115200, 57600, 38400, 19200</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">12</font></td>
        <td align="center"><font size="0">data bit</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Data bit length. 5 - 8</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">13</font></td>
        <td align="center"><font size="0">polarity</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  None<br>1:  Odd<br>2:  Even</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">14</font></td>
        <td align="center"><font size="0">stop bit</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Stop bit number</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">15</font></td>
        <td align="center"><font size="0">receive buffer size</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Receive buffer size, Maximum 2048</font></td>        
    </tr>
    <tr>
        <td align="center"><font size="0">19</font></td>
        <td align="center"><font size="0">reserved</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">0x00</font></td>        
    </tr>    
</table>

*Example:*
```markdown
→ 4A 01 00 00 10 00 21 27 FF FF 00 C2 01 00 08 00 01 2C 01 00 00 00      ;GPIO_2_1, GPIO_2_7, 115200bps
← 4A 01 00 00 02 00 00 00                                                ;Local response
```

## Network Parameter Configuration (ID=2)

This command configure module's network parameters. It is for local only. If network parameters are stored afterwords by [Reset](#reset-id1) command, 
module can be run automatically without sending it again.

For gateway module, the command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">gateway module device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x1000 to 0xF000, where the lower 12 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">8</font></td>
        <td align="center"><font size="0">access address on connection</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when data communication after connection</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">12</font></td>
        <td align="center"><font size="0">access address on pairing</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when pairing procedure</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">16</font></td>
        <td align="center"><font size="0">channel on pairing</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Channel on which pairing procedure is.</font></td>
    </tr>
</table>

*Example:*
```markdown
;Device address (Gateway) is 0x1000, Access Addresses are 0x67453201 and 0xABABABAB, Channel on pairing is 37
→ 4A 02 00 00 0B 00 00 10 01 23 45 67 AB AB AB AB 25   
← 4A 02 00 00 02 00 00 00
```

For node module, the command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">node module device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x0000 to 0x0FFF, where the upper 4 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">8</font></td>
        <td align="center"><font size="0">gateway device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">A 16-bit value that can only be taken from 0x1000 to 0xF000, where the lower 12 bits are all zeros.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">10</font></td>
        <td align="center"><font size="0">access address on pairing</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Access Address when pairing procedure</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">14</font></td>
        <td align="center"><font size="0">channel on pairing</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Channel on which pairing procedure is.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">15</font></td>
        <td align="center"><font size="0">connection interval</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Node's connection interval.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">17</font></td>
        <td align="center"><font size="0">supervision timeout</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Time in millisecond, that allowed for a device to receive data or signals from another device. If no data is received within this timeframe, the connection may be considered lost or disconnected.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">21</font></td>
        <td align="center"><font size="0">pair interval</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Time interval in millisecond for sending pairing interaction information. The smaller the interval, the faster the pairing will be successful, but power consumption will increase.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">23</font></td>
        <td align="center"><font size="0">pairing duration</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">Duration of pairing procedure in millisecond. 0 if non stop.</font></td>
    </tr>
</table>

*Example:*
```markdown
;Node's device address is 0x0100, access address on pairing is 0x67453201, connection interval is 800ms, supervision timeout is 20000ms, pair interval is 50ms and pairing is not stopped.
→ 4A 02 00 00 15 00 00 01 00 10 AB AB AB AB 25 20 03 20 4E 00 00 32 00 00 00 00 00
← 4A 02 00 00 02 00 00 00
```

## External Power Amplifier Control Configuration (ID=3)

This command sets up module's external Power Amplifier (PA) Control function. It is for local only. This command is optional, meaning that if not configured, the module will use following default GPIOs:

- TX enable:   GPIO_3_3
- RX enable:   GPIO_2_5
- BIAS:        unused

The TX enable GPIO will automatically output high to open electronic circuits of power amplifier when RF is opened for transmission. RX enable GPIO and BIAS GPIO share similar working principles. 

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">TX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control Tx_En of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_3_3, it is 0x33.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">RX GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control Rx_En of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_2_5, it is 0x25.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">8</font></td>
        <td align="center"><font size="0">BIAS GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is used to control bias of expernal PA. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. If no bias control, set it to 0xFF.</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 03 00 00 03 00 33 25 FF      ;TX GPIO is GPIO_3_3, RX GPIO is GPIO_2_5, no BIAS
← 4A 03 00 00 02 00 00 00         ;Local response
```

## Get State (ID=10)

This command retrieves the module status. It is for local only.

The length of this command is 0. The response is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
        <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">state</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">Current module state.<br>0:  Not running, module may not be fully configured yet<br>1:  Running</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 0A 00 00 00 00         ;Try retrieving module status
← 4A 0A 00 00 01 00 01      ;Module is running normally
```

## Get Connection (ID=11)

This command retrieves the number of connected modules and corresponding device addresses. For nodes, a return value of 0 of number indicates not connected. It is for local only.

The length of this command is 0. The response is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
        <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">count</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Number of connected devices</font></td>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">count*2</font></td>
        <td><font size="0">Device addresses of connected modules. </font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 0B 00 00 00 00                           ;Try retrieving the connection status of gateway
← 4A 0B 00 00 07 00 03 00 01 01 01 02 01      ;Gateway has connected with 3 nodes 0x0100, 0x0101 and 0x0102
```
```markdown
→ 4A 0B 00 00 00 00                           ;Try retrieving the connection status of node
← 4A 0B 00 00 03 00 01 00 10                  ;Node returns connection with gateway with device address 0x1000
```

## Module Reset (ID=0x20)

This command resets the module. For node module, this command is local only (***Owner** field is ignored. For gateway module it can be locally or remotely executed. The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">option</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  Reset<br>1:  Reset module with previous configuration cleared<br>2:  Reset module with previous configuration stored</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 20 00 00 01 00 02         ;Save configuration before reset for local module
← 4A 20 00 00 02 00 00 00      ;Local response
```
```markdown
→ 4A 20 00 01 01 00 00         ;Reset remote module 0x0100 from gateway
← 4A 20 00 00 02 00 00 00      ;Local module accepts command
← A4 A2 04 00 00 01 00 00      ;Transmission done event
← 4A 20 00 01 02 00 00 00      ;Remote response from node 0x0100
```

## Modue Run (ID=0x21)

This command start or stop running of module. For node module, this command is local only.  For gateway module it can be locally or remotely execution. 
If [Network Parameter Configuration](#network-parameter-configurationid5) is not stored, it is necessary to send this command to start the module, 
otherwise module will automatically start running after power on reset.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">running</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  Stop</br>1:  Start</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 21 00 00 01 00 01         ;Start running of local module (either gateway or node)
← 4A 21 00 00 02 00 00 00      ;Local response
```
```markdown
→ 4A 21 00 01 01 00 00         ;Stop running of remote node 0x0100 (from gateway)
← 4A 21 00 00 02 00 00 00      ;Local response
← A4 A2 04 00 00 01 00 00      ;Transmission done event
← 4A 21 00 01 02 00 00 00      ;Remote response from node with device address 0x0100
```

## Module GPIO Output (ID=0x22)

The command allows the module's specified GPIO pin outputs to a designated level.  For node, this command is local only. For gateway it can be called locally or remotely.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is configured as output functionality. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">level</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">Output level.<br>0        :   Low level<br>other :  High level</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 22 00 00 04 00 01 01            ;Node module's GPIO_0_1 outputs high
← 4A 22 00 00 02 00 00 00            ;Local response
```
```markdown
→ 4A 22 01 01 04 00 01 01                  ;Remote control node 0x0101 module's GPIO_0_1 to output high from gateway
← 4A 22 00 00 02 00 00 00                  ;Local response
← A4 66 04 00 01 01 00 00                  ;Transmission to node 0x0101 done
← 4A 22 01 01 02 00 00 00                  ;Remote response received from node 0x0101
```

## Module GPIO Input Trigger (ID=0x23)

This command allows module to trigger a [GPIO input event](#gpio-input-trigger-event-id0x68) when GPIO is in a specified state. For node module, this command is local only, but the event can be either sent to its HOST via UART or remote connected device over the air depending on *target* field in command. For gateway module, if the command is local and then the event can only be sent to HOST via UART regarding of *target* field in command. If the command is remote execution, the event can be either sent to remote HOST via its UART or remotely to connected device over the air. To short, *target* field defines whether the event will be sent to the remote connected device corresponding to the executor of this command, with the condition that this remote device MUST only be a gateway module.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which is configured as input functionality. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">internal pull up/down</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  no pull up/down<br>1:  internal pull up<br>2:  internal pull down</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">8</font></td>
        <td align="center"><font size="0">edge-triggered condition</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0x00:  falling edge<br>0x01:  rising edge<br>0x02:  both edge<br>0xFF:  none</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">9</font></td>
        <td align="center"><font size="0">target</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  local HOST<br>1:  remote connected device</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 23 00 00 04 00 04 01 00 01      ;node module GPIO_0_4 falling edge trigger with internal pull up enabled, event will be remotely sent to gateway.
← 4A 23 00 00 02 00 00 00            ;Local response
```
```markdown
→ 4A 23 01 01 04 00 04 01 00 01      ;gateway remotely set node module (0x0101) GPIO_0_4 falling edge trigger with internal pull up enabled, event will be remotely sent to gateway.
← 4A 23 00 00 02 00 00 00            ;Local response
← A4 A2 04 00 00 10 00 00            ;Transmission done event
← 4A 23 01 01 02 00 00 00            ;Remote response
...
← A4 A4 04 00 01 01 04 00            ;GPIO Input trigger event
```

## Data Transmission (ID=0x30)

This command initiates user data transmission either from Gateway to Node or Node to Gateway. Module will return local response first like any other commands 
and then [Transmission Done Event](#transmission-done-eventid0x66) indicating actual wireless transmission is finished or not.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">data</font></td>
        <td align="center"><font size="0">variable length</font></td>
        <td style="white-space: pre;"><font size="0">Banary byte data array</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 30 01 01 03 00 0A 0B 0C      ;Send 3 bytes (0A 0B 0C) from gateway to node 0x0101
← 4A 30 00 00 02 00 00 00         ;Local response
← A4 A2 04 00 01 01 00 00         ;Transmission done event
```
```markdown
→ 4A 30 00 10 03 00 0A 0B 0C      ;Send 3 bytes from node to gateway 0x1000
← 4A 30 00 00 02 00 00 00         ;Local response
← A4 A2 04 00 00 10 00 00         ;Transmission done event
```

## Firmware Update command (ID=0x40)

This command initiates Firmware Update to module. For node, this command is local only, while for gateway it can be called locally or remotely. If remotely, node's firmware is updated over the air. Firmware Update consists of 3 processes, Prepare, Write, Cancel. Each process is composed of different data packet.

### Prepare

The first process is to tell Node the firmware update over the air is going to begin, along with information including new firmware size, CRC verification, AES encryption etc.

The command is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">process</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0"></font>0</td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">firmware size</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0"></font>firmware size</td>
    </tr>
    <tr>
        <td align="center"><font size="0">11</font></td>
        <td align="center"><font size="0">flag</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">Each bit set to 1 indicates that the corresponding function is enabled.<br>bit 0:  AES encryption<br>bit 4:  CRC check<br>other:  N/A</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">12</font></td>
        <td align="center"><font size="0">CRC</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0">CRC value of part of firmware binary excluding the first 16K bytes. If CRC check in flag is not set, it's ignored.</font></td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 40 01 01 0A 00 00 20 1B 01 00 00 00 00 00 00      ;OTA prepare to node 0x0101, firmware size is 72,480 bytes, no CRC check and AES encryption
← 4A 40 00 00 02 00 00 00                              ;Local response
← A4 A2 00 00 04 00 01 01 00 00                        ;Transmission done event
← 4A 40 01 01 02 00 00 00                              ;Remote response received from node 0x0101
```
### Write

This process is called several times to do actual firmware data transmission until finished.

The data packet is as follows:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">process</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0"></font>1</td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">offset</font></td>
        <td align="center"><font size="0">4</font></td>
        <td><font size="0"></font>firmware offset</td>
    </tr>
    <tr>
        <td align="center"><font size="0">11</font></td>
        <td align="center"><font size="0">data</font></td>
        <td align="center"><font size="0">Len-7</font></td>
        <td><font size="0"></font>data length that follows</td>
    </tr>
</table>

*Example:*
```markdown
→ 4A 40 01 01 <len> 01 00 00 00 00 ...       ;OTA write firmware data to node 0x0101, offset is 0, size is <len> bytes
← 4A 40 00 00 02 00 00 00                    ;Local response
← A4 A2 00 00 04 00 01 01 00 00              ;Transmission done event
← 4A 40 01 01 02 00 00 00                    ;Remote response (4A 0B 02 00 00 00) received from node 0x0101
```

### Cancel

This command cancel any on-going OTA firmware update process.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">process</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0"></font>0xFF</td>
    </tr>
</table>


*Example:*
```markdown
→ 4A 40 01 01 01 00 FF            ;OTA cancel firmware update to node 0x0101
← 4A 40 00 00 02 00 00 00         ;Local response
← A4 A2 04 00 01 01 00 00         ;Transmission done event
← 4A 40 01 01 02 00 00 00         ;Remote response (4A 0B 02 00 00 00) received from node 0x0101
```

# Response

A Response is the data packet returned by the module, indicates whether the command has been accepted or not. The body of Response is a fixed length of two bytes called Result, following the same header as the corresponding command. The Response can be local response sent by local module, or remote response sent by remote module, which is included in the data of the [Data Reception Event](#data-reception-eventid0x67). Both local response and remote response share the same data structure.

The available Result values are as follows:

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
        <td align="center"><font size="0">0x1001</font></td>0
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

# Event Description

An Event is the data packet actively sent by the module to the HOST. Events have Sync Word 0xA4 in their data packet and unique event identifier follows.  The format of the data packet is as follows.

<br>

|Sync Word|ID|Body Len|Body|
|---|---|---|---|
|(1 byte)|(1 byte)|(2 bytes)|(variable)|

*Figure 1: Event data packet format*

<br>

- **Sync Word:** Fixed 0xA4.

- **ID:**  unique event id.

- **Body Len:** is the length of variable body that follows.

Here are details of MultiConnNet events:

## Module Ready Event (ID=0xA0)

This event indicates system is ready to accept command from HOST. It has no body so the body len field is 0.

*Example:*
```markdown
← A4 A0 00 00
```

## Connection Event (ID=0xA1)

This event indicates Gateway/Node has successfully connected or disconnected to each other.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">connection</font></td>
        <td align="center"><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0:  disconnect<br>1:  connect</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">5</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td ><font size="0">Remote device address</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 A1 03 00 01 00 01      ;Gateway has connected with node 0x0100
```

## Transmission Done Event (ID=0xA2)

This event indicates data has been actually transmitted over the air.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
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
← A4 A2 04 00 00 01 00 00           ;Gateway has transmitted data to node with device address 0x0100
```

## Data Reception Event (ID=0xA3)

This event indicates data has been received from remote connected devices.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Remote device address</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">data</font></td>
        <td align="center"><font size="0">Len-2</font></td>
        <td><font size="0">Banary byte data array</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 A3 05 00 00 01 00 01 02      ;Gateway has received 3 bytes data from node 0x0100
```

## GPIO Input Trigger Event (ID=0xA4)

This event indicates GPIO's input status is triggered, which is configured by [GPIO Input Configuration](#gpio-input-configurationid7) command. This event can be sent to local HOST or remote devices, depending on device address parameter in event data body.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="15%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
    </tr>
    <tr>
        <td align="center"><font size="0">4</font></td>
        <td align="center"><font size="0">device address</font></td>
        <td align="center"><font size="0">2</font></td>
        <td><font size="0">Remote device address, or local if 0.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">6</font></td>
        <td align="center"><font size="0">GPIO</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">GPIO which input status is triggered. The upper 4 bits represent the Port, and the lower 4 bits represent the Pin. For example, for GPIO_0_4, it is 0x04.</font></td>
    </tr>
    <tr>
        <td align="center"><font size="0">7</font></td>
        <td align="center"><font size="0">level</font></td>
        <td align="center"><font size="0">1</font></td>
        <td><font size="0">Current GPIO level</font></td>
    </tr>
</table>

*Example:*
```markdown
← A4 A4 04 00 01 01 04 00      ;Node 0x0101 GPIO_0_4 falling edge trigger
```