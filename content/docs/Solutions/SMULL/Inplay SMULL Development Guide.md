---
title: "SMULL Command Set"
---

# Inplay SMULL Command Set For Transparent Data Transmission
---

## Introduction

IN618 is InPlay’s SMULL SoC product which features synchronous multi-node low-latency protocol (SMULL) stack with 2.4Ghz frequency band RF radio and MCU system integrated. The device incorporates an InPlay SMULL radio and subsystem that contains the RF transceiver, baseband, PHY and link layer engines.The physical layer has the digital PHY and RF transceiver that transmits and receives GFSK packets at 2Mbps. The PHY can also be configured to 1Mbps mode to transmits and receives 1Mbps modulated packets.

The baseband controller combines both hardware and software implementation that supports variety of communication modes between master and slave devices: Unicast, multi-cast and broadcast modes. In a typical start topology network, as shown in Figure 1, the central node will operate as the master and the peripheral nodes will operate as the slave nodes. The communication between the master and the slaves can be unidirectional or bi-directional.<br>
![InPlay SMULL network topology](/images/smull_dt/fig1_topology.png "Figure 1: InPlay SMULL network topology")

The baseband controller can be configured as either master or slave operation mode. The communication between the master and the slaves is framed based communication as shown in Figure 2. On each frame, the master sends a broadcast packet, or a public packet, or a downlink private packet (DPP) to each of the slaves. As illustrated in Figure 2, assume there are N slaves,and each slave has a unique ID number from {0, 1, 2, …, N-1}. Each salve can send an uplink private (UP) packet at the assigned time (t0, t1, …,) in the frame to the master. The packets sent from the master share the same preamble and network address. Each packet from the slave has its own preamble and network address. And all the timing critical functions in the baseband controller are implemented in hardware such as CRC, data whitening and access address detection.
![Frame based communication](/images/smull_dt/fig2_frame.png "Figure 2: Frame based communication")

Data exchange can operate in three modes between a master and multiple slaves.<br>
**Private Data Exchange Mode**
The master can send each slave a private packet in every frame, and each slave can send a private packet to the master.
*Private packet: Acknowledgment occurs between the sender and recipient.*<br>
**Public Data Exchange Mode**
The master can send a public packet to all slaves in each frame.<br>
*Public packet: Slaves provide acknowledgment. The master will not send the next public packet until all slaves have acknowledged the current one.*<br>
**Broadcasting Mode**
The master can send a broadcast packet to all slaves in each frame.<br>
*Broadcast packet: Slaves do not acknowledge receipt of a broadcast packet.*

## Overview of Transparent Data Transmission
Many modern applications rely on wireless data transmission, but end-users often lack knowledge or interest in the underlying technologies. We have designed a mechanism that enables users to leverage the powerful data transfer capabilities of SMULL without needing to understand the protocol details. Before initiating data transmission, the relevant SMULL parameters must be configured to establish a network between the master and slaves. Using our provided commands, you can quickly set up the SMULL network. Please refer to the [example](#example) for more details. Figure 3 illustrates the entire system, showing the connection between the host and the IN618 module.<br>
![Schematic](/images/smull_dt/fig3.png "Figure 3: Schematic")
Typically, the host refers to devices such as personal computers (PCs), laptops, microcontroller units (MCUs), and others. In the current architecture, the host and IN618 communicate through UART. The default UART settings in our system are as follows:<br>

### UART Default Settings

- 115,200 bps
- 8 bits
- No parity
- 1 stop bit
- Hardware flow control disabled

The [uart configuration](#configure-uart-0xa064) command can be used to modify the UART settings.

## Command Set
To facilitate software development with SMULL, we have designed a set of programming commands. Users can easily initiate the system using these commands. The command format is as follows:<br>
|Command Code|Data Length|Data |
|---|---|---|
|2 bytes|2 bytes|variable bytes|


*Table 1*
- Error Codes:
  
  | Error Code  | Description                                                       |
  | ----------- | --------------------------------------------------------------- |
  | 0x00        | No errors                                                       |
  | 0x01        | Wrong format                                                    |
  | 0x02        | Unspecified error                                               |
  | 0x03        | Invalid parameter                                               |
  | 0x04        | Hardware error                                                 |



### **Get Slave Number: 0xA011**
This command gets the number of slaves in the current network.
Send: 		`0xA0 0x11 0x00 0x00`

Response: 	`0xA0 0x11 0x00 0x01 <slv num>`
- **slv num**: Number of slaves.


### **Set Slave Number: 0xA012**
This command configures the number of slaves. 
Send:    `0xA0 0x12 0x00 0x01 <slv num>`
- **slv num**: Number of slaves, from 1 to 127.


Response:   `0xA0 0x12 0x00 0x01 <error code>`
- **error code**: See Table 1.


### **Get Slave ID: 0xA013**
This command gets the slave ID.

Send:    `0xA0 0x13 0x00 0x00`

Response:   `0xA0 0x13 0x00 0x01 <slv id>`
- **slv id**: Slave ID.


### **Get Network Address (Access Address): 0xA015**
This command retrieves the network address. Each established network must have a unique network address (access address).

Send: `0xA0 0x15 0x00 0x00`

Response:   `0xA0 0x15 0x04 <addr byte 3> <addr byte 2> <addr byte 1> <addr byte 0>`
- addr: Network address, 4bytes.



### **Get PHY Rate: 0xA017**
This command gets the PHY rate. Supported PHY rates are 1Mbps and 2Mbps.

Send:    `0xA0 0x17 0x00 0x00`

Response:   `0xA0 0x17 0x00 0x01 <phy>`
- **phy**: PHY rate. 0x01: 1 Mbps, 0x02: 2 Mbps

### **Set PHY Rate: 0xA018**
This command sets the PHY rate. 

Send:    `0xA0 0x18 0x00 0x01 <phy>`
- **phy**: PHY rate. 0x01: 1 Mbps, 0x02: 2 Mbps

Response:   `0xA0 0x18 0x00 0x01 <error code>`
- **error code**: See Table 1.



### **Get Mode: 0xA019**
This command gets the current mode. 

Send: `0xA0 0x19 0x00 0x00`


Response:  `0xA0 0x19 0x00 0x01 <mode>`
- **mode**: Device mode. 0x00: slave, 0x01: master

### **Set Mode: 0xA01A**
This command sets the device mode (master or slave). Only one device in a network can be configured as master.

Send:    `0xA0 0x1A 0x00 0x01 <mode>`
- **mode**: Device mode. 0x00: slave, 0x01: master

Response:   `0xA0 0x1A 0x00 0x01 <error code>`
- **error code**: See Table 1.

**Notice:**
> After successful configuration, reset the chip by issuing command `0xA0E1`, or the mode will not be updated.

### **Get Maximum Length of Downlink Private Packet: 0xA01B**
This command gets the maximum length of downlink private packets, which are transmitted from master to slave.

Send:  `0xA0 0x1B 0x00 0x00`

Response:   `0xA0 0x1B 0x00 0x02 <downlink packet length byte 1> <downlink packet length byte 0>`
- **downlink packet length**: Length of downlink private packet.

### **Set Maximum Length of Downlink Private Packet: 0xA01C**
The default length of downlink private packets is 6 bytes. Ensure the value set is equal to or greater than 8 and less than 200.

Send:  `0xA0 0x1C 0x00 0x02 <downlink packet length byte 1> <downlink packet length byte 0>`
- **downlink packet length**: Length of downlink private packet.

Response:   `0xA0 0x1C 0x00 0x01 <error code>`
- **error code**: See Table 1.



### **Get Maximum Length of Uplink Private Packet: 0xA01D**
This command retrieves the maximum length of uplink private packets, which are transmitted from slave to master.

Send:    `0xA0 0x1D 0x00 0x00`

Response:   `0xA0 0x1D 0x00 0x02 <uplink private packet length byte 1> <uplink private packet length byte 0>`
- **uplink private packet length**: Length of uplink private packet.


### **Set Maximum Length of Uplink Private Packet: 0xA01E**
This length should be less than 200.

Send:    `0xA0 0x1E 0x00 0x02 <uplink private packet length byte 1> <uplink private packet length byte 0>`
- **uplink private packet length**: Length of uplink private packet.

Response:   `0xA0 0x1E 0x00 0x01 <error code>`
- **error code**: See Table 1.



### **Get Maximum Length of Broadcast Packet: 0xA01F**
This command retrieves the maximum length of broadcast packets. 

Send:    `0xA0 0x1F 0x00 0x00`


Response:   `0xA0 0x1F 0x00 0x02 <broadcast packet length byte 1> <broadcast packet length byte 0>`
- **broadcast packet length**: Length of broadcast packet.


### **Set Maximum Length of Broadcast Packet: 0xA020**
This length should be less than 200.

Send:    `0xA0 0x20 0x00 0x02 <broadcast packet length byte 1> <broadcast packet length byte 0>`
- **broadcast packet length**: Length of broadcast packet.

Response:   `0xA0 0x20 0x00 0x01 <error code>`
- **error code**: See Table 1.


### **Get SMULL Status: 0xA041**
This command retrieves the current status of SMULL.

Send:    `0xA0 0x41 0x00 0x00`

Response:   `0xA0 0x41 0x00 0x01 <status>`
- **status**: Device status. 0: idle, 1: pair, 2: connecting, 3: connected


### **Get SMULL Configurations: 0xA042**
The SMULL configurations consist of 8 parameters: mode, slave number, slave ID, PHY rate, network address, maximum length of downlink private packet, maximum length of uplink private packet, and maximum length of broadcast packet. You can retrieve all settings by issuing this command.

Send:    `0xA0 0x42 0x00 0x00`

Response: `0xA0 0x42 0x00 0x0E <mode> <slv num> <slv id> <phy> <addr byte 3> <addr byte 2> <addr byte 1> <addr byte 0> <downlink packet length byte 1> <downlink packet length byte 0> <uplink packet length byte 1> <uplink packet length byte 0> <broadcast packet length byte 1> <broadcast packet length byte 0>`
- **mode**: 0: slave, 1: master
- **slv num**: Slave Number.
- **slv id**: Slave ID. 0~(slave number – 1). Master will ignore this value.
- **phy**: PHY Rate. 1: 1 Mbps, 2: 2 Mbps.
- **addr**: network Address.
- **downlink packet length**: Maximum Length of Downlink Private Packet.
- **uplink packet length**: Maximum Length of Uplink Private Packet.
- **broadcast packet length**: Maximum Length of Broadcast Packet.


### **Set SMULL configurations: 0xA043**

As mentioned earlier, the SMULL configurations consist of 8 parameters. You can set these parameters all at once by issuing the following command.

Send:    `0xA0 0x43 0x00 0x0E <mode> <slv num> <slv id> <phy> <addr byte 3> <addr byte 2> <addr byte 1> <addr byte 0> <downlink packet length byte 1> <downlink packet length byte 0> <uplink packet length byte 1> <uplink packet length byte 0> <broadcast packet length byte 1> <broadcast packet length byte 0>`
- **mode**: 0: slave, 1: master
- **slv num**: Number of slaves.
- **slv id**: Slave ID. Ranges from 0 to (slave number – 1). The master will ignore this value.
- **phy**: PHY Rate. 1: 1Mbps, 2: 2Mbps.
- **addr**: Network Address
- **downlink packet length**: Maximum length of the downlink private packet.
- **uplink packet length**: Maximum length of the uplink private packet.
- **broadcast packet length**: Maximum length of the broadcast packet.

Response: `0xA0 0x43 0x00 0x01 <error code>`
- **error code**: Refer to table 1.


### **Start Pairing**

This command initiates the pairing process.

Send:    `0xA1 0x10 0x00 0x03 <pair num / require id> <timeout byte 1> <timeout byte 0>`
- **pair num / require id**: 
    - **pair num**: Used in master mode to specify the number of slaves to pair with. If set to 0, it will pair with all remaining unpaired slaves.
    - **require id**: Used in slave mode. Specifies the desired slave ID that the slave expects, although the master may assign a different ID. If set to 0xFF, it uses the slave ID saved in flash memory.
- **timeout**: Timeout for pairing, measured in milliseconds. A value of 0 means no timeout.

Response:    `0xA1 0x10 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.

### **Stop Pairing**

This command stops the pairing process.

Send:    `0xA1 0x47 0x00 0x00`

Response:    `0xA1 0x47 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.

### **Delete All Pair Information**

This command deletes all pairing information. It is only available in master mode.

Send:    `0xA1 0x13 0x00 0x00`

Response:    `0xA1 0x13 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.

### **Delete Pair Information**

This command un-pairs one device. It is only available in master mode.

Send:    `0xA1 0x14 0x00 0x01 <slv id>`
- **slv id**: Slave ID

Response:    `0xA1 0x13 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.


### **Get Connection Status of All Slaves: 0xA044**

This command allows the user to retrieve the connection status of each slave by issuing it from the master side. It is only available for the master.

Send:    `0xA0 0x44 0x00 0x00`

Response:   `0xA0 0x44 0x00 0x10 <connect status byte 0> <connect status byte 1>... <connect status byte 15>`
- **connect status**: Connection status of each slave. 1: connected, 0: disconnected.
    - **byte 0**: the connection status of slave0 to slave7.
    - **byte 1**: the connection status of slave8 to slave15.
    - **byte 15**: the connection status of slave120 to slave127.

The byte sequence of connect status is a bitmap, where each bit is associated with a slave. Byte 0 corresponds to slave0 to slave7, while Byte 1 corresponds to slave8 to slave15, and so forth. A value of one for the bit indicates that the corresponding slave is connected to the master. Below, we provide two examples to illustrate possible responses:
<br>
Example 1: Assuming that the maximum number of slaves is set to four and all four slaves are connected to the master, the response would be `0xA0 0x44 0x00 0x10 0x0F 0x00...0x00`. Conversely, if only slaves 0 and 3 are connected, the response would be `0xA0 0x44 0x00 0x10 0x09 0x00...0x00`.
<br>
Example 2: If the maximum number of slaves is set to nine and all nine slaves are connected to the master, the response would be `0xA0 0x44 0x00 0x10 0xFF 0x01 0x00…0x00`. However, if only slaves 0, 1, 6, 7, and 9 are connected, the response would be `0xA0 0x44 0x00 0x10 0xB3 0x01 0x00...0x00`.


### **Transmit Data: 0xA048**

This command is used for data transmission between the master and slave once the network is successfully established. The master can transmit three types of packets, while the slave can only transmit private packets. Below, we will provide detailed instructions on how to use this command for both the master and the slave.

① Slave transmits data. The slave can only transmit private packets, so the command sequence is relatively straightforward.

Send:    `0xA0 0x48 <data length byte 1> <data length byte 0> <data byte 0> <data byte 1>....<data byte n>`
- **data length**: The length of the data.
- **data**: The actual data being transmitted.

Response:   `0xA0 0x48 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.

② Master transmits data. The master can transmit three types of packets to the slave: private, public, and broadcast. In the current firmware, we only support private and broadcast packets.

Send:    `0xA0 0x48 <data length byte 1> <data length byte 0> <packet type> <slv id> <data byte 0> <data byte 1>....<data byte n>`
- **data length**: The length of the data, which includes packet type and slv id.
- **packet type**: Packet type, where 0x00 indicates broadcast, 0x01 indicates public, and 0x02 indicates private.
- **slv id**: If the packet type is private, this byte represents the ID of the slave. For broadcast, 0 indicates stopping the broadcast, while 1 indicates continuously broadcasting this data packet.
- **data**: The actual data being transmitted.

Response:   `0xA0 0x48 0x00 0x01 <error code>`
- **error code**: Refer to Table 1.


### **Get UART Configuration: 0xA063**

This command reads the UART configuration.

Send:    `0xA0 0x63 0x00 0x00`


Response:   `0xA0 0x63 0x00 0x08 <baud rate byte 3> <baud rate byte 2> <baud rate byte 1> <baud rate byte 0> <data bits> <stop> <parity> <fc>`
- **baud rate**: The baud rate, with a maximum of 2000000.
- **data bits**: Data bits, range is 5 to 8.
- **stop**: Stop bits, where 0 indicates 1 stop bit and 1 indicates 2 stop bits.
- **parity**: Parity, where 0 indicates no parity, 1 indicates odd parity, and 2 indicates even parity.
- **fc**: Flow control, where 1 indicates enable and 0 indicates disable.


### **Configure UART: 0xA064**

This command writes the UART configuration.

Send:    `0xA0 0x64 0x00 0x08 <baud rate byte 3> <baud rate byte 2> <baud rate byte 1> <baud rate byte 0> <data bits> <stop> <parity> <fc>`
- **baud rate**: The maximum baud rate is 2000000.
- **data bits**: The number of data bits, which can range from 5 to 8.
- **stop**: Stop bits configuration, where 0 indicates 1 stop bit and 1 indicates 2 stop bits.
- **parity**: Parity setting, where 0 means no parity, 1 represents odd parity, and 2 represents even parity.
- **fc**: Flow control, where 1 means enabled and 0 means disabled.


Response:    `0xA0 0x64 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.


### **Get UART Baudrate: 0xA065**

Send:    `0xA0 0x65 0x00 0x00`

Response:    `0xA0 0x65 0x00 0x04 <baud rate byte 3> <baud rate byte 2> <baud rate byte 1> <baud rate byte 0>`
- **baud rate**: The maximum baud rate is 2000000.


### **Set UART Baudrate: 0xA066**

Send:    `0xA0 0x66 0x00 0x04 <baud rate byte 3> <baud rate byte 2> <baud rate byte 1> <baud rate byte 0>`
- **baud rate**: The maximum baud rate is 2000000.

Response:    `0xA0 0x66 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.


### **Chip Reset: 0xA0E1**

Reset the chip.

Send:    `0xA0 0xE1 0x00 0x00`

Response:    `0xA0 0xE1 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.



### **Get Hex version**

Retrieve the version in hexadecimal format.

Send: `0xA1 0x23 0x00 0x00`

Response:    `0xA1 0x23 0x00 0x04 <version bytes 3> <version bytes 2> <version bytes 1> <version bytes 0>`
- **version**: Version number in hexadecimal format.

### **OTA Start**
Initiate the OTA command, available only for the master.

Send: `0xA1 0x19 0x00 0x01 <type>`
- **type**: OTA PDU type, where 0 indicates broadcast and 2 indicates private PDU.

Response:    `0xA1 0x19 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.

### **OTA remote Update para**
The master updates the slave connection parameters for OTA, available only for the master.

Send: `0xA1 0x1D 0x00 0x02 <slv id> <pkt len>`
- **slv id**: Slave ID. Use 0xFF to broadcast to all slaves.
- **pkt len**: Maximum length of the OTA packet.

Response:    `0xA1 0x1D 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.


### **OTA local Update para**
Update the connection parameters for OTA.

Send: `0xA1 0x18 0x00 0x01 <pkt_len>`
- **slv id**: Slave ID. Use 0xFF to broadcast to all slaves.

Response:    `0xA1 0x18 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.


### **OTA local default para**
Reset connection parameters to default settings.

Send: `0xA1 0x1C 0x00 0x00 <pkt len>`

Response:    `0xA1 0x1C 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.


### **OTA End**
Complete the OTA process.

Send: `0xA1 0x1A 0x00 0x00`

Response:    `0xA1 0x1A 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.

### **OTA cmd**
The master sends OTA commands to the slave, available only for the master.

Send: `0xA1 0x1B <len byte1> <len byte0> <slv id> <cmd> ...`
- **len**: Command length.
- **slv id**: Slave ID. Use 0xFF to broadcast to all slaves.
- **cmd**: OTA command bytes.

Response:    `0xA1 0x1B 0x00 0x01 <error code>`
- **error code**: Refer to table 1 for details.

### **OTA result**
Retrieve the OTA result, available only for the master.

Send: `0xA1 0x1E 0x00 0x00`

Response:    `0xA1 0x1E 0x00 0x11 <error code> <result byte 0> <result byte 1> ... <result byte 15>`
- **error code**: Refer to table 1 for details.
- **result**: 1 indicates success, while 0 indicates failure.
	- **byte 0**: Result for slaves 0 to 7.
	- **byte 1**: Result for slaves 8 to 15.
	- ...
	- **byte 15**: Result for slaves 120 to 127.


## **Event**
The event is a command that the device sends to the host.


### **Receive Data: 0xA049**
When the master receives data from the slave(s) or vice versa, the received data will be transmitted to the host in the following format. 

Notification: `0xA0 0x49 <command length byte 1> <command length byte 0> <slv id/packet type> <data byte 0> <data byte 1> ...`
- **command length**: Length of the command.
- **slv id/packet type**: For the master, this is the slave ID. For the slave, this is the packet type (0 = broadcast, 1 = public, 2 = private).
- **data**: Packet data.

### **Pair End**
Indicates the completion of the pairing process.

Notification: `0xC0 0x03 0x00 0x02 <error> <paired num>`
- **error**: Result of the pairing process; 0 indicates no error.
- **paired num**: Number of slaves that have been paired, applicable only in master mode.

### **Pair One**
Indicates the successful pairing with one slave. This is available only in master mode.

Notification: `0xC0 0x02 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

### **Master Connect**
Indicates a successful connection to one slave. This is available only in master mode.

Notification: `0xC0 0x07 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

### **Master Disconnect**
Indicates a disconnection from one slave. This is available only in master mode.

Notification: `0xC0 0x08 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

### **Status**
Indicates a change in the device status, which will trigger this event.

Notification: `0xC0 0x04 0x00 0x01 <status>`
- **status**: Device status, where 0 indicates idle, 1 indicates pairing, 2 indicates connecting, and 3 indicates connected.
Note:
	- For the master, the connected status means all slave devices are connected.
	- For the master, the connecting status means at least one slave is disconnected.


### **Error**
Indicates an error has occurred; the device may need to reset or perform a factory reset.

Notification: `0xC0 0x01 0x00 0x01 <error>`
- **error**: Error code indicating the type of issue.

### **OTA Ack**
Indicates the result of an OTA command.

Notification: `0xC1 0x00 <length byte 1> <length byte 0> <data byte 0> <data byte 1> ...`
- **length**: Length of the command.
- **data**: Result data indicating the outcome.



## **Debug Command**
The debug command is intended for debugging purposes only. Please note that it SHOULD NOT be used in actual projects. This command has not been fully tested and may be removed or modified in future versions.

### **Set Debug Mode**

Send:    `0xA1 0x1F 0x00 0x01 <mode>`
- **mode**: 1 for debug mode, 0 for release mode.

Response:    `0xA1 0x1F 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Read RAM Log**
The master reads the log stored in the slave's RAM. This command is only available in master mode, and the master prints the log to the log UART.

Send:    `0xA1 0x15 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

Response:    `0xA1 0x15 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Reset RAM Log**
The master resets the slave's log pointer, allowing the master to re-read the log from the slave. This command is only available in master mode.

Send:    `0xA1 0x16 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

Response:    `0xA1 0x16 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Read Slave Flash Log**
Read the log stored in the slave's flash memory.

Send:    `0xA1 0x24 0x00 0x00`

Response:    `0xA1 0x24 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Reset Slave Flash Log**
Reset the pointer for the slave's flash log.

Send:    `0xA1 0x25 0x00 0x00`

Response:    `0xA1 0x25 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Dump Flash Log**
Dump the contents of the flash log.

Send:    `0xA1 0x26 0x00 0x00`

Response:    `0xA1 0x26 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Erase Flash Log**
Erase the contents of the flash log.

Send:    `0xA1 0x27 0x00 0x00`

Response:    `0xA1 0x27 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Set Command UART ID**
Set the command UART ID. If the command UART ID is the same as the log UART ID, the hexadecimal characters of the command will be printed in the log UART.

Send:    `0xA1 0x17 0x00 0x01 <uart id>`
- **uart id**: Command UART ID.

Response:    `0xA1 0x17 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Remote Command**
Send a command from the master to the slave.

Send:    `0xA2 0x01 <len byte 1> <len byte 0> <slv id> <cmd byte 0> <cmd byte 1> ...`
- **len**: Command length.
- **slv id**: Slave ID.
- **cmd**: Command bytes.

Response:    `0xA2 0x01 0x00 0x01 <error code>`
- **error code**: See table 1.

### **GPIO Config**
Configure GPIO settings.

Send:    `0xA1 0x20 0x00 0x05 <port> <pin> <pinmux> <oe_ie> <pull_up_down>`
- **port**: GPIO port.
- **pin**: GPIO pin.
- **pinmux**: GPIO pinmux.
- **oe_ie**: OE/IE setting, where 0 = High Z, 1 = input, 2 = output, 3 = input and output.
- **pull_up_down**: Pull up/down setting, where 0 = no pull up/down, 1 = pull up, 2 = pull down.

Response:    `0xA1 0x20 0x00 0x01 <error code>`
- **error code**: See table 1.

### **GPIO Output**
Configure GPIO output level.

Send:    `0xA1 0x21 0x00 0x03 <port> <pin> <output>`
- **port**: GPIO port.
- **pin**: GPIO pin.
- **output**: Output level, where 1 = high and 0 = low.

Response:    `0xA1 0x21 0x00 0x01 <error code>`
- **error code**: See table 1.

### **GPIO Input Status**
Get the status of GPIO input.

Send:    `0xA1 0x22 0x00 0x02 <port> <pin>`
- **port**: GPIO port.
- **pin**: GPIO pin.

Response:    `0xA1 0x22 0x00 0x02 <error code> <status>`
- **error code**: See table 1.
- **status**: GPIO input status, where 1 = high and 0 = low.


### **Get Superframe Duration: 0xA03A**
This command retrieves the superframe duration in slots. Refer to Figure 2 for an illustration of the superframe.

Send:    `0xA0 0x3A 0x00 0x00`

Response: `0xA0 0x3A 0x00 0x02 <superframe duration byte 1> <superframe duration byte 0>`
- **superframe duration**: Duration of the SMULL superframe.


## **Deprecated Command**
These commands will be deprecated in future versions and should not be used in any new projects.
### **Get Firmware Version Number: 0xA0EB**
This command retrieves the firmware version.

Send:    `0xA0 0xEB 0x00 0x00`

Response:    `0xA0 0xEB 0x00 0x06 <version byte 0> <version byte 1> ... <version byte 6>`
- **version**: Firmware version. The version number is a string formatted as "v<hex num byte 2>.<hex num byte 1>.<hex num byte 0>". See "Get Hex version".

### **Set network Address (Network Address): 0xA016**
This command sets the network address. The value 0x00000000 will be ignored, and the address will not be updated. The value 0xFFFFFFFF is also not accepted.

Send:    `0xA0 0x16 0x00 0x04 <addr byte 3> <addr byte 2> <addr byte 1> <addr byte 0>`
- **addr**: Network address.

Response:   `0xA0 0x16 0x00 0x01 <error code>`
- **error code**: See table 1.

### **Successful Pairing Notification: 0xA03B**
This command indicates that all slaves have been successfully paired with the master. This notification is automatically sent to the host when the pairing process is complete.

Notification:   `0xA0 0x3B 0x00 0x01 <error>`
- **error**: Result of the pairing process.


### **Set Slave ID: 0xA014**
This command sets the slave ID on the slave side. Each slave in a network must have a unique ID. Only available for slave.

Send:  `0xA0 0x14 0x00 0x01 <slv id>`
- **slv id**: Slave ID.

Response:   `0xA0 0x14 0x00 0x01 <error code>`
- **error code**: See table 1.

## Best Practice for Pairing
- The slave can enter pairing mode using the command `A1 10 00 03 FF 00 00`, setting the slave ID to `0xFF` and the timeout (tmo) to `0x00`. This way, if it has already paired, the slave ID remains unchanged. If it has not been paired before, the slave ID will start from `0`.
- The master can enter pairing mode using the command `A1 10 00 03 00 00 00`, setting the pair number to `0x00`, which means it will wait until all slaves have completed pairing before exiting.
- First, use the "Delete All Pair Info" command to clear all pairing information. Then, let the master enter pairing mode before allowing each slave to enter pairing mode one by one. This way, the slave IDs will start from `0`, allowing for confirmation of each slave's ID.
- The master should first configure the necessary parameters (such as slave number, uplink/downlink packet length, broadcast packet length, and PHY) before entering pairing mode.

## Best Practice for Debugging
- First, ensure the master is in debug mode.
- If the slave cannot conveniently print logs, the master can send the "Read RAM Log" command to retrieve the slave's logs. It may be necessary to send this command multiple times to gather all logs.
- If the slave experienced an error and restarted, the master can send the "Read Slave Flash Log" command to retrieve logs from when the slave encountered the error.
- Both the master and slave can use the "Dump Flash Log" command to print logs from when errors occurred.
- If the slave cannot conveniently receive commands via the serial port, the master can use the "Remote Command" to send commands to the slave. This is equivalent to sending commands directly via the serial port. The master can use a broadcast packet (with slave ID set to `0xFF`) to send commands to all slaves or use a private packet to send commands to a specific slave. For example, `A2 01 00 08 FF A1 10 00 03 00 00 00` can be used to put all slaves into pairing mode.
- If the slave cannot conveniently use the serial port for commands, the "Remote Command" can be used to send "GPIO Config" and "GPIO Output" commands to toggle the GPIO pin of an LED, allowing the current slave ID to be determined.
- If the PC lacks sufficient serial ports, the command UART can be set to `0x1` using "Set Command UART ID", making it the same as the log UART. This allows commands to be sent and logs to be viewed simultaneously through the log UART.



