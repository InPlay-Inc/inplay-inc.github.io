---
title: "BLE5.0 AT Command Set"
---

# Inplay BLE 5.0 AT Command Set
---

## INTRODUCTION

Inplay IN6xx BLE module is a standard Bluetooth Low Energy (BLE) 5.0 certified RF module. It introduces a private service as interface of data streaming between two BLE devices transparently.

IN6xx BLE module provides the control interface based on ASCII commands, say AT commands. They are used to configure parameters, retrieve module state, control actions of module, etc. All configuration changes can be optionally remained in Non-Volatile Memory (Flash) and survive the following power cycle.

## CONTROL INTERFACE

The AT commands are transmitted over standard UART interface. A terminal emulator, such as TeraTerm (Windows) or CoolTerm (Mac OS-X®), can be used to control the module from a computer,  with the following default port settings:

- 115,200 bps
- 8 bits
- No Parity
- 1 Stop bit
- Hardware flow control disabled

The [serial port parameter configure](#uartcfg) command can modify the UART settings permanently.

## SYNTAX

The AT commands can be divided into 3 main categories: Command, Response and Event. The module receives Command and, after execution, sends back Response to the command initiator. When something happens in the module, such as an unexpected disconnection, receiving data from a remote device, etc., a corresponding Event is sent.

### **COMMAND SYNTAX**

An AT command is composed of the Prefix, CommandID, CommandBody and Terminator as shown below.

~~~markdown
                AT+<CommandID>=<CommandBody><Terminator>
~~~

The Prefix of each command is fixed ASCII string "AT" or "at".

CommandID is an ASCII string representing different command. It's case sensitive.

CommandBody can be either ASCII '?' if the command *gets* a parameter or parameters set if the command *sets* parameter. A parameter set is a collection of parameters surrounded by '[]', each separated by ','.

Terminator of each command is carriage return (CR, '\r', \x0d) and line feed (LF, '\n', \x0a). Command is accepted and executed only when the Terminator is received.

### **RESPONSE SYNTAX**

After an AT command is executed, a response will be sent back. Response consists of corresponding CommandID, ResponseBody and Terminator as shown below. 

~~~markdown
                +<CommandID>=<ResponseBody><Terminator>
~~~

If command is to *set* parameter, the ResponseBody is either parameter set read or just a numerical error result code. The format of the read parameter set is same as the format of the *set* parameters of the corresponding command. Only result code is returned for *set* parameter commands. 

### **EVENT SYNTAX**

An event is a message reported by the module initiatively, rather than a response obtained through the AT command. An event consists of EventID, EventBody and Terminator as shown in below.

~~~markdown
                +<EventID>=<EventBody><Terminator>
~~~

EventID is an ASCII string representing different event. It's case sensitive. EventBody is a parameter set and its format is same as CommandBody in AT command. Terminator is same as that in AT command response.

### **PARAMETER VALUE**

Parameter in parameter set supports numeric values, strings. There are three format of string: ASCII format string, Byte Array format string and Base64 encoding format string.

### **EXAMPLES**

The below table lists some examples of AT commands and their responses and events.

<table width="100%" border="1">
    <tr>
        <th width="33%" align="center" bgcolor="#cccccc">Command/Event</th>
        <th width="33%" align="center" bgcolor="#cccccc">Function</th>
        <th width="52%" align="center" bgcolor="#cccccc">Response</th>
    </tr>
    <tr>
        <td><font size="0">AT+DEVCFG=[10,"112222222211",0,"Slave",1]</font></td>
        <td><font size="0">Set device general configuration</font></td>
        <td><font size="0">+DEVCFG=0000H</font></td>
    </tr>
    <tr>
        <td><font size="0">AT+DEVCFG=?</font></td>
        <td><font size="0">Get device general configuration</font></td>
        <td><font size="0">+DEVCFG=[10,"112222222211",0,"Slave",1]</font></td>
    </tr>    
    <tr>
        <td><font size="0">AT+CFGADVACTV=[1,0,1,500,0,"BwlJbnBsYXk="]</font></td>
        <td><font size="0">Create legacy connectable advertising in 500ms interval. The payload is local name "Inplay"</font></td>
        <td><font size="0">+CFGADVACTV=0000H: successful<br>+CFGADVACTV=0043H: error advertising can't be create</font></td>
    </tr>
    <tr>
        <td><font size="0">-EVTCONN=[1,"EFBBCCCCDDEF",1,1]</font></td>
        <td><font size="0">Connected with device "EF:DD:CC:CC:BB:EF" on 1M PHY</font></td>
        <td><font size="0"></font></td>
    </tr> 
</table>

## COMMAND REFERENCE

This section describes AT commands in detail and provides examples. Those parameter surrounded by '<>' brackets are optional in some cases. If an optional parameter needs to be set, all optional parameters prior to that optional parameter must also be provided.

Since the responseBody of the response returned by the *get* command is the same as the CommandBody of the corresponding *set* command, for simplicity, only the format of the *get* command is listed.

1. ### **Get Module State**

This command *gets* the current status of the module.

Command:    <span style="color:blue;">**AT+STATE=?**</span>

Response:   <span style="color:blue;">**+STATE=[sys_state,pair_state,conn_state,scan_state,adv_state]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">sys_state</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Not ready;<br>1:  Ready</font></td>
    </tr>
    <tr>
        <td><font size="0">pair_state</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Not paired;<br>1:  Paired</font></td>
    </tr>
    <tr>
        <td><font size="0">conn_state</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Unconnected<br>1:  Connecting <br>2:  Connected</font></td>
    </tr>
    <tr>
        <td><font size="0">scan_state</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Scanning Stopped;<br>1:  Scanning Started</font></td>
    </tr>
    <tr>
        <td><font size="0">adv_state</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Advertising Stopped;<br>1:  Advertising Started</font></td>
    </tr>
</table>

Example:

> *→AT+STATE=?<br>←+STATE=[1,0,0,0,0]*

- ### **Get Version**

This command *gets* the version of the module including chip version, sdk version and firmware version

Command:    <span style="color:blue;">**AT+VER=?**</span>

Response:   <span style="color:blue;">**+VER=[chip_ver,sdk_ver,fw_ver]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">chip_ver</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Chip version</font></td>
    </tr>
    <tr>
        <td><font size="0">sdk_ver</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">SDK version</font></td>
    </tr>
        <tr>
        <td><font size="0">fw_ver</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Firmware version</font></td>
    </tr>
</table>

Example:

> *→AT+VER=?<br>←+VER=["602F0100","3.0.0","xxxx"]*

- ### **UART Configuration**

This command *sets* UART parameters. Once UART parameter is changed, module will automatically reset and all parameters configured before will be lost.

Command:    <span style="color:blue;">**AT+CFGUART=[baud_rate,<data_bit>,<polarity>,<stop_bit>]**</span>

Response:   <span style="color:blue;">**+CFGUART=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">baud_rate</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Standard UART baud rate value</font></td>
    </tr>
    <tr>
        <td><font size="0">data_bit</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">5 - 8 bits</font></td>
    </tr>
    <tr>
        <td><font size="0">polarity</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">0：No polarity<br>1：Odd polarity<br>2：Even polarity<br>Other: invalid value</font></td>
    </tr>
    <tr>
        <td><font size="0">stop_bit</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">0: 1 stop bits<br>1: 2 stop bits</font></td>
    </tr>    
</table>

Example:

> *→AT+CFGUART=[921600,8,0,1]<br>←+CFGUART=0000H*

- ### **Device General Configuration**

This command ***gets*** or ***sets*** the general parameters of the module.

Command:    <span style="color:blue;">**AT+CFGDEV=[mode,dev_addr,addr_type,dev_name,phy]**</span>

Response:   <span style="color:blue;">**+CFGDEV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">mode</font></td>
        <td><font size="0">Number</font></td>
        <td>
            <table width="100%" border="0">
                <tr> <td><font size="0">1</font></td> <td><font size="0">Observer Mode</font></td> </tr>
                <tr> <td><font size="0">2</font></td> <td><font size="0">Broadcaster Mode</font></td> </tr>
                <tr> <td><font size="0">5</font></td> <td><font size="0">Central Mode</font></td> </tr>
                <tr> <td><font size="0">10</font></td> <td><font size="0">Peripheral Mode</font></td> </tr>
                <tr> <td><font size="0">15</font></td> <td><font size="0">All Role Mode</font></td> </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td><font size="0">dev_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing MAC address of device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">addr_type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Public address;<br>1:  Static random address</font></td>
    </tr>
    <tr>
        <td><font size="0">dev_name</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">ASCII</font></td>
    </tr>
    <tr>
        <td><font size="0">phy</font></td>
        <td><font size="0">Number</font></td>
        <td>
            <table width="100%" border="0">
                <tr> <td><font size="0">0</font></td> <td><font size="0">Random</font></td> </tr>
                <tr> <td><font size="0">1</font></td> <td><font size="0">1M Phy</font></td> </tr>
                <tr> <td><font size="0">2</font></td> <td><font size="0">2M Phy</font></td> </tr>
                <tr> <td><font size="0">4</font></td> <td><font size="0">Coded Phy</font></td> </tr>
            </table>
        </td>
    </tr>
</table>

Example:

> *//Set device as BLE Peripheral, device public MAC address is 11-22-22-22-22-11, device name is "Slave" and prefered PHY is 1M PHY<br>→AT+CFGDEV=[10,"112222222211",0,"Slave",1]<br>←+CFGDEV=0000H*

> *//Set device as All role and prefered PHY is Coded Phy<br>→AT+CFGDEV=[15,"AABB0101BBAA",0,"Slave",4]<br>←+CFGDEV=0000H*

- ### **Data Transparent Transmission Service Configuration**

This command ***gets*** or ***sets*** parameters of Inplay private data transparent tranmission service as GATT server, including service UUID, maximum data transmission size etc. After the execution of the command, the service with specified parameters will be created. It MUST be sent after [+CFGDEV](#device-general-configuration)

It is only allowed by device with 'Peripheral role' or 'All role', otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGTRXSVC=[start_hdl,<svc_uuid>,<max_data_sz>]**</span>

Response:   <span style="color:blue;">**+CFGTRXSVC=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">start_hdl</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">The start GATT handle of service<br>0: automatically created<br>other: user specific handle number</font></td>
    </tr>    
    <tr>
        <td><font size="0">svc_uuid</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing 16-byte service UUID in little-endian mode<br>Default is "ccddb4f8-cdf3-11e9-a32f-2a2ae2dbcce4"</font></td>
    </tr>
    <tr>
        <td><font size="0">max_data_sz</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Data transmission size, 1 - 1024 bytes.<br>Default 20 bytes</font></td>
    </tr>    
</table>

Example:

> *//Set service UUID as 1122b4f8-cdf3-11e9-a32f-2a2ae2dbcce4 and the maximum transmission data as 512 bytes.<br>→AT+CFGTRXSVC=[0,"e4ccdbe22a2a2fa3e911f3cdf8b42211",512]<br>←+CFGTRXSVC=0000H*

> *//Set service UUID by default. Fixed service start handle to 20<br>→AT+CFGTRXSVC=[20]<br>←+CFGTRXSVC=0000H*

- ### **Data Transparent Transmission Client Configuration**

This command ***gets*** or ***sets*** parameter of Inplay private data transparent tranmission service as GATT client. If parameters are not set or parameter 'start_hdl' is set to 0, device will initiate a Service Discovery Process (SDP) to find remote service after connection.

It is only allowed by device with 'Central role' or 'All role', otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGTRXCLT=[start_hdl,<svc_uuid>,<max_data_sz>]**</span>

Response:   <span style="color:blue;">**+CFGTRXCLT=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">start_hdl</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">The start GATT handle of service<br>0: automatically get by SDP<br>other: user specific handle number</font></td>
    </tr>    
    <tr>
        <td><font size="0">svc_uuid</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing 16-byte service UUID in little-endian mode<br>Default is "ccddb4f8-cdf3-11e9-a32f-2a2ae2dbcce4"</font></td>
    </tr>
    <tr>
        <td><font size="0">max_data_sz</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Data transmission size, 1 - 1024 bytes. Default 20 bytes</font></td>
    </tr>
</table>

Example:

> *//Set to discover service by SDP.<br>→AT+CFGTRXCLT=[0,"e4ccdbe22a2a2fa3e911f3cdf8b42211",512]<br>←+CFGTRXCLT=0000H*

> *//Set specific start handle and leave other in default, so that SDP is not necessary.<br>→AT+CFGTRXCLT=[20]<br>←+CFGTRXCLT=0000H*

- ### **RF Configuration**

This command *gets* or *sets* RF related parameter.

Command:    <span style="color:blue;">**AT+CFGRF=[tx_power]**</span>

Response:   <span style="color:blue;">**+CFGRF=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">tx_power</font></td>
        <td><font size="0">Number</font></td>
        <td>
            <font size="0">TX power:</font>
            <table width="100%" border="0">
                <tr><td><font size="0">0</font></td><td><font size="0">Max TX power (~8dBm)</font></td></tr>
                <tr><td><font size="0">1-15</font></td><td><font size="0">7dBm to 0dBm with step 0.5dBm</font></td></tr>
                <tr><td><font size="0">16-22</font></td><td><font size="0">-1dBm to -7dBm with step -1dBm</font></td></tr>
            </table>
        </td>
    </tr>
</table>

Example:

> *//Set TX power +3dBm<br>→AT+CFGRF=[9]<br>←+CFGRF=0000H*

- ### **SMP Configuration**

This command *gets* or *sets* security parameters of the module.

Command:    <span style="color:blue;">**AT+CFGSMP=[smp,dev_io_cap,pairing_code]**</span>

Response:   <span style="color:blue;">**+CFGSMP=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">smp</font></td>
        <td><font size="0">Number (1 byte)</font></td>
        <td>
            <table width="100%" border="0">
                <tr>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">LE Secure Connection</font></td>
                    <td><font size="0">MITM</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">Encryption</font></td>
                </tr>
                <tr>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">Bit3</font></td>
                    <td><font size="0">Bit2</font></td>
                    <td><font size="0">-</font></td>
                    <td><font size="0">Bit0</font></td>
                </tr>
            </table>
            <font size="0">0: false;  1: true</font>
        </td>
    </tr>
    <tr>
        <td><font size="0">dev_io_cap</font></td>
        <td><font size="0">Number</font></td>
        <td align="center">
            <table width="100%" border="0">
                <tr> <td><font size="0">0</font></td> <td><font size="0">Display Only</font></td> </tr>
                <tr> <td><font size="0">1</font></td> <td><font size="0">Display Yes No</font></td> </tr>
                <tr> <td><font size="0">2</font></td> <td><font size="0">Keyboard Only</font></td> </tr>
                <tr> <td><font size="0">3</font></td> <td><font size="0">Keyboard Display</font></td> </tr>
                <tr> <td><font size="0">4</font></td> <td><font size="0">No Input No Output</font></td> </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td><font size="0">pairing_code</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">ASCII Paring code</font></td>
    </tr>
</table>

Example:

> *//Set SMP to MITM security and encryption, with ability of keyboard input. The corresponding MITM pairing code is 012345<br>→AT+CFGSMP=[5,2,"012345"]<br>←+CFGSMP=0000H*

- ### **Target Device Configuration**

This command *gets* or *sets* the target devices that are allowed to connect or scan. It is available when [scan activity](#scan-activity-configuration) or [initiating activity](#initiating-activity-configuration) is configured with right 'type' value. Maximum 25 target devices can be set.

It is only allowed by device with ‘Central role’ or ‘All role’, otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGTARGET=[dev1_addr,dev1_addr_type,<dev2_addr>,<dev2_addr_type>,...]**</span>

Response:   <span style="color:blue;">**+CFGTARGET=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">dev_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing MAC address of target device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">dev_addr_type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Public address;<br>1:  Static random address</font></td>
    </tr>    
</table>

Example:

> *→AT+CFGTARGET=["112222222211",0,"AABBCCCCDDEE",0]<br>←+CFGTARGET=0000H*

- ### **Advertising Activity Configuration**

This command ***sets*** parameter to create BLE advertising activity. Multiple advertising activities can be created one by one.

It is only allowed for device that is configured 'Peripheral role’ or ‘All role’ mode, otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGADVACTV=[actv_id,adv_type,connectable,intv,chn,payload]**</span>

Response:   <span style="color:blue;">**+CFGADVACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for advertising activity</font></td>
    </tr>
    <tr>
        <td><font size="0">adv_type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Legacy Advertise <br>1:  Extended Advertise</font></td>
    </tr>
    <tr>
        <td><font size="0">connectable</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Unconnectable <br>1:  Connectable</font></td>
    </tr>
    <tr>
        <td><font size="0">intv</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">20-10240ms</font></td>
    </tr>
    <tr>
        <td><font size="0">chn</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  all BLE advertising channel<br>37-39:  Fixed channel</font></td>
    </tr>
    <tr>
        <td><font size="0">payload</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">BLE standard advertising data format in base64 encoding<br>Length (1 byte) + Type (1 byte) + Content (length -1 byte)</font></td>
    </tr>
</table>

Example:

> *//Set legacy connectable advertising in 500ms interval. The payload is local name "Inplay"<br>→AT+CFGADVACTV=[1,0,1,500,0,"BwlJbnBsYXk="]<br>//Successfully set<br>←+CFGADVACTV=0000H*

- ### **Scan Activity Configuration**

This command ***sets*** parameter to create BLE scan activity. Only one scan activity can be created.

It is only allowed by device with ‘Central role’ or ‘All role’, otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGSCANACTV=[actv_id,type]**</span>

Response:   <span style="color:blue;">**+CFGSCANACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for scan activity</font></td>
    </tr>
    <tr>
        <td><font size="0">type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">2:  Observer<br>3:  Selective observer. Only devices configured by +CFGTARGET will be reported </font></td>
    </tr>
</table>

Example:

> *//Set scan activity<br>→AT+CFGSCANACTV=[20,3]<br>//Successfully set<br>←+CFGSCANACTV=0000H*

- ### **Initiating Activity Configuration**

This command ***sets*** parameter to create BLE initiating activity to establish connections with the target device. Only one initiating activity can be created.

It is only allowed for device that is configured ‘Central role’ or ‘All role’ mode, otherwise 1001H [error code](#error-code) is returned.

Command:    <span style="color:blue;">**AT+CFGINITACTV=[actv_id,type]**</span>

Response:   <span style="color:blue;">**+CFGINITACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for advertising activity</font></td>
    </tr>
    <tr>
        <td><font size="0">type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Direct connect<br>1:  Auto connect. Only devices configured by +CFGTARGET can be connected </font></td>
    </tr>
</table>

Example:

> *//Create initiating activity to auto connect with target devices.<br>→AT+CFGINITACTV=[10,1]<br>//Successfully set<br>←+CFGINITACTV=0000H*

> *//Create initiating activity to direct connect with remote device.<br>→AT+CFGINITACTV=[10,0]<br>//Successfully set<br>←+CFGINITACTV=0000H*

- ### **Start Scan Activity**

This command start scan activity that is created by previous [+CFGSCANACTV](#scan-activity-configuration) command.

Command:    <span style="color:blue;">**AT+SCANACTV=[actv_id,op,\<intv>,\<wnd>,\<duration>,\<dup_filter>]**</span>

Response:   <span style="color:blue;">**+SCANACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for scan activity</font></td>
    </tr>
    <tr>
        <td><font size="0">op</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Stop Activity<br>1:  Start Activity</font></td>
    </tr>
    <tr>
        <td><font size="0">intv</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Scan activity interval 3-40959ms</font></td>
    </tr>
    <tr>
        <td><font size="0">wnd</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Scan running time, must be less than intv</font></td>
    </tr>
    <tr>
        <td><font size="0">duration</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Forever<br>10-655350: Actual duration in ms.</font></td>
    </tr>
    <tr>
        <td><font size="0">dup_filter</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  No filtering<br>1:  Filter duplicates within the duration</font></td>
    </tr>
</table>

Example:

> *//Start scan activty permanently<br>→AT+SCANACTV=[20,1,200,100,0,1]<br>//Successfully set<br>←+SCANACTV=0000H*

> *//Stop scan activity<br>→AT+SCANACTV=[20,0]<br>←+SCANACTV=0000H*

- ### **Start Advertising Activity**

This command start advertising activity that is created by previous [+CFGADVACTV](#advertising-activity-configuration) command.

Command:    <span style="color:blue;">**AT+ADVACTV=[actv_id,op,\<duration>]**</span>

Response:   <span style="color:blue;">**+ADVACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for advertising activities</font></td>
    </tr>
    <tr>
        <td><font size="0">op</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Stop Activity<br>1:  Start Activity</font></td>
    </tr>
    <tr>
        <td><font size="0">duration</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Forever<br>10-655350: Actual duration in ms.</font></td>
    </tr>
</table>

Example:

> *//Start advertising activty permanently<br>→AT+ADVACTV=[1,1,0]<br>//Successfully set<br>←+ADVACTV=0000H*

> *//Stop advertising activity<br>→AT+ADVACTV=[1,0]<br>←+ADVACTV=0000H*

- ### **Start Initiating Activity**

This command start initiating activity that is created by previous [+CFGINITACTV](#initiating-activity-configuration) command. When activity is started permanently, it will end until devices either specified by 'target_addr' parameter or configured by [+CFGTARGET](#target-device-configuration) are connected.

Command:    <span style="color:blue;">**AT+INITACTV=[actv_id,op,\<target_addr>,\<addr_type>,\<conn_intv>,\<latency>,\<sup_tmo>,\<duration>]**</span>

Response:   <span style="color:blue;">**+INITACTV=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Unique ID for initiating activity</font></td>
    </tr>
    <tr>
        <td><font size="0">op</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Stop Activity<br>1:  Start Activity</font></td>
    </tr>
    <tr>
        <td><font size="0">target_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">The Byte Array format string representing MAC address of target device in little-endian mode. Only valid when initiating 'type' is 0</font></td>
    </tr>
    <tr>
        <td><font size="0">addr_type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">Target device's MAC address type. Only valid when initiating 'type' is 0 in<br>0:  public<br>1: static random</font></td>
    </tr>
    <tr>
        <td><font size="0">conn_intv</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Connection interval: 7.5 - 4800 ms</font></td>
    </tr>
    <tr>
        <td><font size="0">latency</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">0 - 499</font></td>
    </tr>
    <tr>
        <td><font size="0">sup_tmo</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">100 - 32000 ms</font></td>
    </tr>
    <tr>
        <td><font size="0">duration</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Forever<br>10-655350:  Actual duration in ms.</font></td>
    </tr>
</table>

Example:

> *//Start initiating activty to peer device "66-55-44-33-22-11"<br>→AT+INITACTV=[10,1,"112233445566",0,200,0,20000,0]<br>//Successfully set<br>←+INITACTV=0000H*

> *//Start initiating activty to devices set by +CFGTARGET<br>→AT+INITACTV=[10,1,"",0,200,0,20000,0]<br>//Successfully set<br>←+INITACTV=0000H*

> *//Stop initiating activity<br>→AT+INITACTV=[10,0]<br>←+INITACTV=0000H*

- ### **Get current connection list**

This command *gets* a list of currently connected devices.

Command:    <span style="color:blue;">**AT+CONNLST=?**</span>

Response:   <span style="color:blue;">**+CONNLST=[<dev1_addr>,<dev1_mode>,<dev2_addr>,<dev2_mode>,...]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">dev_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">The Byte Array format string representing MAC address of peer device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">dev_mode</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Peer device as Master role;<br>1:  Peer device as Slave role</font></td>
    </tr>
</table>

Example:

> *→AT+CONNLST=?<br>//Connect to master device "66-55-44-33-22-11" and a peripheral device "FF-EE-DD-CC-BB-AA"<br>←+CONNLST=["112233445566",0,"AABBCCDDEEFF",1]*

- ### **Start Pairing**

This command start operation of BLE pairing with connected device.

Command:    <span style="color:blue;">**AT+BOND=[op,dest_addr,<pairing_code>]**</span>

Response:   <span style="color:blue;">**+BOND=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">op</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Cancel pairing<br>1:  Start pairing</font></td>
    </tr>
    <tr>
        <td><font size="0">dest_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">The Byte Array format string representing MAC address of connected device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">pairing_code</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">6 bytes ASCII pairing code</font></td>
    </tr>
</table>

Example:

> *→AT+BOND=[1,"112233445566","012345"]<br>←+BOND=0000H*

> *//Stop pairing<br>→AT+BOND=[0]<br>←+BOND=0000H*

- ### **Data Transmit**

This command transmit data via Inplay private transparent transmission service.

Command:    <span style="color:blue;">**AT+DATATX=[dest_addr,data]**</span>

Response:   <span style="color:blue;">**+DATATX=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">dest_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">The Byte Array format string representing MAC address of destination connected device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">data</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Base64 encoding string representing binary data to transmit</font></td>
    </tr>
</table>

Example:

> *//Send data "0x0001020304050607080910" to remove device "66-55-44-33-22-11"<br>→AT+DATATX=["112233445566","AAECAwQFBgcICRA="]<br>←+DATATX=0000H*

- ### **Reset**

This command causes the system to reset. While execution, application can choose whether to save or clear current configured parameters permanently. This command don't have any response. The application determines whether reset is complete or not by receiving the [+EVTREADY](#evtready) event.

Command:    <span style="color:blue;">**AT+SYSRST=[op]**</span>

Response:   <span style="color:blue;">**N/A**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">op</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Reset module<br>1:  Reset after saving current parameters to Flash<br>2:  Reset after clearing current parameter from Flash</font></td>
    </tr>
</table>

Example:

> *→AT+SYSRST=[1]*

- ### **Watchdog**

This command set up watch dog.

Command:    <span style="color:blue;">**AT+SYSWDT=[wdt_enable,wdt_int_pol,wdt_tmo]**</span>

Response:   <span style="color:blue;">**+SYSWDT=err_code**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">wdt_enable</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Disable<br>1:  Enable</font></td>
    </tr>
    <tr>
        <td><font size="0">wdt_int_pol</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Low level trigger interrupt<br>1:  High level trigger interrupt</font></td>
    </tr>
    <tr>
        <td><font size="0">wdt_tmo</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">1 - 65536 seconds</font></td>
    </tr>
</table>

Example:

> *→AT+SYSWDT=[1,0,60]<br>←+SYSWDT=0000H*

## EVENT REFERENCE

- ### **-EVTREADY**

This event indicates module is ready to accept AT commands. It is usually received after power on reset or [+SYSRST](#reset) command is executed.

Event:    <span style="color:blue;">**-EVTREADY=[prev_state]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">prev_state</font></td>
        <td><font size="0">Number</font></td>
        <td>
            <table>
                <tr><td><font size="0">0</font></td> <td><font size="0">Power on reset or reset command with op 0</font></td></tr>
                <tr><td><font size="0">1</font></td> <td><font size="0">Reset command with op 1</font></td></tr>
                <tr><td><font size="0">2</font></td> <td><font size="0">Reset command with op 2</font></td></tr>
                <tr><td><font size="0">3</font></td> <td><font size="0">Watch dog reset</font></td></tr>
            </table>
        </td>
    </tr>
</table>

Example:

> *-EVTREADY=[1]*

- ### **-EVTCONN**

This event indicates device has been connected or disconnected.

Event:    <span style="color:blue;">**-EVTCONN=[state,peer_addr,mode,phy]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">state</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">0: Disconnect<br>1: Connect</font></td>
    </tr>
    <tr>
        <td><font size="0">peer_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing MAC address of peer device in little</font></td>
    </tr>
    <tr>
        <td><font size="0">mode</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">0: Device is connected as Master role;<br>1: Device is connected as Slave role</font></td>
    </tr>    
    <tr>
        <td><font size="0">phy</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Phy that connection on. Please refer to PHY parameter in command +DEVCFG </fond></td>
    </tr>
</table>

Example:

> *//Successfully connected with remote Master device "EF:DD:CC:CC:BB:EF" on 1M PHY.<br>-EVTCONN=[1,'EFBBCCCCDDEF',1,1]*

- ### **-EVTDATA**

This event indicates the data reception from peer device.

Event:    <span style="color:blue;">**-EVTDATA=[peer_addr,data]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">peer_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing MAC address of peer device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">data</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Base64 encoding format string representing binary data received</fond></td>
    </tr>
</table>

Example:

> *//Data "0x0001020304050607080910" received from remove device "66-55-44-33-22-11”<br>-EVTDATA=["112233445566","AAECAwQFBgcICRA="]*

- ### **-EVTADV**

This event indicates that an advertising signal has been scanned.

Event:    <span style="color:blue;">**-EVTADV=[dev_addr,addr_type,conn,rssi,payload]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">dev_addr</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Byte Array format string representing MAC address of advertising device in little-endian mode</font></td>
    </tr>
    <tr>
        <td><font size="0">addr_type</font></td>
        <td><font size="0">Number</font></td>
        <td style="white-space: pre;"><font size="0">0:  Public<br>1:  Static random</font></td>
    </tr>
    <tr>
        <td><font size="0">rssi</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">Signed integer in dBm</font></td>
    </tr>    
    <tr>
        <td><font size="0">payload</font></td>
        <td><font size="0">String</font></td>
        <td><font size="0">Base64 encoding format string representing advertising payload binary data</fond></td>
    </tr>
</table>

Example:

> *//A connectable ad with local name 'Inplay' as payload from device '66-55-44-33-22-11' is scanned. RSSI is -80dBm.<br>-EVTADV=["112233445566",0,-80,"BwlJbnBsYXk="]*

- ### **-EVTACTVEND**

This event indicates the termination of the command [+SCANACTV](#start-scan-activity), [+ADVACTV](#start-advertising-activity), [+INITACTV](#start-initiating-activity) and [+BOND](#start-pairing), whether the commands are terminated automatically or manually.

Event:    <span style="color:blue;">**-EVTACTVEND=[actv_type,actv_id]**</span>

<table width="100%" border="0">
    <tr>
        <th width="8%" align="center" bgcolor="#cccccc">Parameter</th>
        <th width="10%" align="center" bgcolor="#cccccc">Type</th>
        <th width="82%" align="center" bgcolor="#cccccc">Value</th>
    </tr>
    <tr>
        <td><font size="0">actv_type</font></td>
        <td><font size="0">Number</font></td>
        <td>
            <table>
                <tr><td><font size="0">0</font></td> <td><font size="0">Advertising activity</font></td></tr>
                <tr><td><font size="0">1</font></td> <td><font size="0">Scan activity</font></td></tr>
                <tr><td><font size="0">2</font></td> <td><font size="0">Initiating activity</font></td></tr>
                <tr><td><font size="0">3</font></td> <td><font size="0">Bond</font></td></tr>
            </table>
        </td>
    </tr>
    <tr>
        <td><font size="0">adv_actv_id</font></td>
        <td><font size="0">Number</font></td>
        <td><font size="0">If advertising activity, this is the advertising activity ID that terminates</font></td>
    </tr>
</table>

Example:

> *//Advertising activity 1 has ended<br>-EVTACTVEND=[0,1]*

> *//Scan activity has ended<br>-EVTACTVEND=[1,20]*

## ERROR CODE

The ERROR CODE is returned as a hexadecimal value. Please refer to following table for details.

<table width="100%" border="0">
    <tr> <td width="60%"><font size="0">0000H</font></td>  <td width="80%"><font size="0">Command executed successfully</font></td> </tr>
    <tr> <td width="60%"><font size="0">1001H</font></td>  <td width="80%"><font size="0">Wrong command execution</font></td> </tr>
    <tr> <td width="60%"><font size="0">100AH</font></td>  <td width="80%"><font size="0">Wrong CommandID</font></td> </tr>
    <tr> <td width="60%"><font size="0">100BH</font></td>  <td width="80%"><font size="0">Wrong format</font></td> </tr>
    <tr> <td width="60%"><font size="0">100DH</font></td>  <td width="80%"><font size="0">Wrong parameter</font></td> </tr>
    <tr> <td width="60%"><font size="0">100EH</font></td>  <td width="80%"><font size="0">Execution overtime</font></td> </tr>
    <tr> <td width="60%"><font size="0">Others</font></td> <td width="80%"><font size="0">BLE error. Refer to in_ble_error.h in SDK</font></td> </tr>
</table>