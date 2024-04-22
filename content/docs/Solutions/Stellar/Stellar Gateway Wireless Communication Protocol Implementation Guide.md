---
title: "Wireless Communication Protocol"
---

# Stellar Gateway Wireless Communication Protocol Implementation Guide
---

## Purpose

This guide offers a comprehensive overview of the Stellar Gateway Wireless Communication Protocol, focusing on its practical implementation. Covering the design, functional operation, command structure, and safety precautions, it is tailored for developers, system integrators, and technical professionals who seek a deep understanding of how to effectively employ and optimize devices using the Stella Gateway Wireless Protocol.

## Definition Glossary

**BLE (Bluetooth Low Energy)**: A power-efficient version of the classic Bluetooth wireless technology. It's designed for short bursts of long-range radio connection, making it perfect for IoT (Internet of Things) applications.

**SDR (Software Defined Radio)**: A radio communication system where traditional hardware components like modulators, demodulators, and tuners are instead implemented in software. This allows for more flexibility and adaptability in handling various frequencies and communication types.

**GATT (Generic Attribute Profile)**: A specification that describes in detail how attributes (data) are transferred once devices have connected using BLE.

**GATT Handler**: Refers to the specific GATT characteristic or descriptor handle, which identifies a particular piece of data on a BLE device.

**BLE Peripheral**: Refer to BLE standard Peripheral devices that gateway supports. It can be either BLE advertiser only (BLE beacon) or connectable peripheral devices.

**BLE Data Exchange**: Refers to BLE data transmission and reception with connectable BLE Peripheral following standard BLE GATT protocol.

**SDR Network Address**:  InPlay SDR devices use two-layer addressing to support network communications.
There are network address and device address. The network address is shared by all the devices 
in an SDR basic network.

**SDR Device Address**: Each InPlay SDR device is assigned to have a 16-bit address. This address can be used to facilitate private data communication in a network with multiple SDR devices.

**SDR Broadcast**: A kind of wireless signal transmission by SDR on broadcast channel, which does not concern if signals are actually received no not. In this case, SDR Device Address is not necessary.

**SDR Private Data Exchange**:  A kind of wireless signals transmission by SDR on non-broadcast channel between given SDR node and Stellar Gateway. If acknowledgement is not received from peer, communication is considered failed. In this case, SDR Device Address is necessary for both two sides of communication, in Stellar world, Stellar Gateway and SDR Node. 

**SDR Node**: Refer to slave devices by SDR in the Stellar Gateway network. It can be device that transmit SDR Broadcast only, or one that support SDR Private Data Exchange simultaneously.

**Scanner Module**: A functional component of Stellar Gateway that actively searches for available devices or signals of either SDR Broadcast or BLE advertisement within its vicinity.

**Transceiver Module**: A functional component of Stellar Gateway that can transmit and receive signals of either SDR Private Data Exchange or BLE Data Exchange.

**Controller**: Refers to the dedicated hardware or software component responsible for overseeing, managing, and directing the operations and data flow of the unit. It ensures that signals are received, processed, and transmitted appropriately, interfacing with both the Scanner Module and the Transceiver Module to achieve optimal performance.

**Error Code**: A system-defined numeric value that signifies a specific type of error or issue encountered during command execution.

## Introduction

The Stellar Gateway Wireless Communication Protocol Implementation Guide delves deep into the Stellar Gateway Wireless Module's practical use. This module is an integral component in today's wireless communication ecosystems. It effectively integrates the Scanner and Transceiver modules, with the Controller MCU as the primary interface and managerial component. 
### System Diagram

The Stellar Gateway system block diagram is shown in Figure1. The Stella Gateway contains 4 IN612Ls as key parts of Stella Gateway Wireless Modules. From the functional point of view, they can be subdivided into Scanner and Transceiver Module. Also present in the gateway is the Controller module, which serves as the connection between these two wireless modules and an interaction with the host.
### Scanner Module:

Its primary function is to scan SDR Broadcasts or BLE Advertisements. It incorporates three IN612Ls, with each one designated to scan a specific channel.
### Transceiver Module:

One IN612L is in this module which dedicated on SDR P2P Data Exchange or BLE Data Exchange with connectable BLE Peripheral.
### Controller:

A third-party MCU typically processes commands from the host. Upon receiving these commands, it interprets them and sends the relevant data structure to both the Scanner and Transceiver for radio activities. Furthermore, this Controller acquires advertising or broadcasting reports from the Scanner, filters these reports, and subsequently sends a singular event to the Host.
In Stella Gateway, the Controller uses AT32F413 and its development is beyond the scope of this document. Please visit ARTERY website for AT32F413 SDK and any reference development documents.
This document aims to explain the data exchange protocols between the Controller and the Scanner/Transceiver.

![](/images/stellar_gateway_diagram.png)

Figure 1: Stella Gateway diagram
## Communication Interface

The interface between each IN612L and the Controller is USART bus. For AT32F413 controller, the USART ports with 612Ls are USART1, USART2, USART3, UART4.
 
The default USART parameters are as follows:

- 921600 bps
- 8 bits
- No Parity
- 1 Stop bit
- Hardware flow control disabled

For interface between Controller and Host, Please refer to Stella Gateway Hardware User Guide for more details.
## Command Description

Data exchanged between the Controller and Scanner/Transceiver is formatted as a byte array. All values follow the Big-endian convention (MSB first).

1. ### Module Reset

This command is used to reset any IN612L in Scanner or Transceiver. It is essential for system maintenance and troubleshooting.
The Reset command is unique in that no response is returned upon its execution. 

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Reset"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Reset Option</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">System Reset</font></td>
    </tr>
</table>

Response: N/A

Example:

> *→01 01*

2. ### Module Configure

This command configures the type of IN612L, either as Scanner or Transceiver, as well as the SDR Broadcast access address and SDR P2P Data Exchange access address. It’s core setting command that must be executed first for system initialization. Once executed, it should NOT be called again unless the “Reset” command is issued.

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">2</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Configure"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Module</font></td>
        <td><font size="0">1</font></td>
        <td style="white-space: pre;"><font size="0">0: Scanner<br>1: Transceiver</font></td>
        <td><font size="0">Module type that IN612L configures to</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">2</font></td>
        <td><font size="0">SDR broadcast network address</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">32 bit Number</font></td>
        <td style="white-space: pre;"><font size="0">Network address of SDR broadcast. If 0, SDR broadcast is not available</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">SDR private network address</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">32 bit Number</font></td>
        <td style="white-space: pre;"><font size="0">Network address of SDR private data exchange. If 0, SDR private data exchange is not available</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">10</font></td>
        <td><font size="0">SDR address</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">0x0001 - 0xFF</font></td>
        <td style="white-space: pre;"><font size="0">SDR address for gateway when SDR private data exchange.</font></td>
    </tr>
</table>

Response:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">2</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Configure"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Result</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">Error Code</font></td>
        <td><font size="0">Command Error Code</font></td>
    </tr>
</table>

Example:

> *//Configure 612L as Scanner. SDR Broadcast on netword address 0x11223344, SDR Private Data Exchange on network address 0x33445566, and gateway's SDR address is 1.<br>→02 00 44 33 22 11 66 55 44 33 01 00*

> *//Configure 612L as Transceiver. SDR Broadcast on netword address 0x11223344, SDR Private Data Exchange on network address 0x33445566, and gateway's SDR address is 1.<br>→02 01 44 33 22 11 66 55 44 33 01 00*

> *//Command successful.<br>←02 00 00*

3. ### Module Start Control

This command provides dynamic operational control (start or stop) of the Scanner or Transceiver. Only IN612L with same Module type which is set via “Configure” command can accept this command with same “Module” parameters.

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">3</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Module Start Control"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Module</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0 , 1</font></td>
        <td style="white-space: pre;"><font size="0">0: Scanner<br>1: Transceiver</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">2</font></td>
        <td><font size="0">SDR Channel</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1 - 40</font></td>
        <td><font size="0">Channel SDR broadcast on. Available only for "Scanner" module.</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">3</font></td>
        <td><font size="0">SDR Window</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">0 - 4000</font></td>
        <td><font size="0">SDR broadcast scan time in microseconds. Available only for "Scanner" module. 0 to stop SDR scan. If SDR is not supported, its value is skipped.</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">BLE Channel</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0 , 37 - 39</font></td>
        <td><font size="0">If 0, scan in turn on all three BLE advertising channel; or else scan on fixed channel.</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">BLE Window</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">0 - 4000</font></td>
        <td><font size="0">BLE advertising scan time in microseconds. Available only for "Scanner" module. 0 to stop BLE scan.</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">2</font></td>
        <td><font size="0">Sync Interval</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">0 , 100 - 60000</font></td>
        <td><font size="0">The time interval at which the Transceiver will transmit a synchronization signal. 0 to stop synchronization signal transmission. The shorter synchronize interval is, the more frequently SDR nodes wake up to exchange data with gateway and raise date rate of SDR Private Data Exchange accordingly. The cost is power consumption of the node. Available only for "Transceiver" module. If SDR is not supported, its value is skipped.</font></td>
    </tr>
</table>

Response:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">3</font></td>
        <td><font size="0">Command Id for "Module Start Control"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Result</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">16bits unsigned integer</font></td>
        <td><font size="0">Command Error Code</font></td>
    </tr>
</table>

Example:

> *//Start SDR broadcast only scan every 1000ms on channel 15.<br>→03 00 0F E8 03 00 00 00*

> *//Start BLE advertising only scan every 1000ms on all 37 to 39 channels.<br>→03 00 00 00 00 00 E8 03*

> *//Start Transceiver with sync interval 100ms.<br>→03 01 64 00*

> *//Error Scanner parameter not set (0x0111).<br>←03 11 01*

4. ### Set Scan Filter

This command allows setting a filter for the Scanner based on specific criteria to help in narrowing down and focusing on specific data while scanning. This command is allowed be executed dynamically while Scanner has started. Another way is to stop Scanner first, set the filter and start again, which makes scan report more clear and accurate. This command is acceptable for Scanner only.

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">4</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Set Scan Filter"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0 - 10</font></td>
        <td><font size="0">Filter bytes array length</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">2</font></td>
        <td><font size="0">Filter</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">Bytes array</font></td>
        <td><font size="0">Filter raw bytes array</font></td>
    </tr>
</table>

Response:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">4</font></td>
        <td style="white-space: pre;"><font size="0">Command Id for "Set Scan Filter"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Result</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">16bits unsigned integer</font></td>
        <td><font size="0">Command Error Code</font></td>
    </tr>
</table>

Example:

> *//Set filter manufacturer ID 0x004c (Apple Inc).<br>→04 02 4C 00*

> *//Command successful.<br>←04 00 00*

5. ### SDR Multicast Data

This command initiates SDR multicast data to SDR nodes. Multicast data is transmitted over synchronizing signals in Transceiver  as a result all kinds of SDR nodes can receive data. But it’s up to SDR node’s implementation (group id match etc.) whether data is acceptable.
This command is acceptable for Transceiver module only.

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">5</font></td>
        <td><font size="0">Command Id for "SDR Multicast Data"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Group Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0 - 255</font></td>
        <td><font size="0">Group Id that SDR node belongs to</font></td>
    </tr>
    <tr>
        <td><font size="0">2</font></td>
        <td><font size="0">Duration</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">unsigned short</font></td>
        <td><font size="0">Time that the command executes in ms. 0 to stop.</font></td>
    </tr>
    <tr>
        <td><font size="0">4</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1 - 251</font></td>
        <td><font size="0">SDR multicast data length</font></td>
    </tr>
    <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">Date</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">-</font></td>
        <td><font size="0">Multicast data</font></td>
    </tr>
</table>

Response:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">5</font></td>
        <td><font size="0">Command Id for "Set Scan Filter"</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Result</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">16bits unsigned integer</font></td>
        <td><font size="0">Command Error Code</font></td>
    </tr>
</table>

Example:

> *//Send multicast data "00 01" to SDR nodes with group id 1 for 1000ms<br>→05 01 03 e8 02 00 01*

> *//Command completes successfully<br>←05 00 00

6. ### SDR Private Data Exchange

This command initiates SDR Private Data Exchange between Transceivers and single SDR nodes that support private data exchange. It’s direct, private two-way communication between node and gateway.
This command is acceptable for Transceiver only.

Command:

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">6</font></td>
        <td><font size="0">Command Id for "SDR Private Data Exchange"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Virtaul ID</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">unsigned long</font></td>
        <td><font size="0">Virtual ID of SDR node</font></td>
    </tr>
    <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">Group ID</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">unsigned char</font></td>
        <td><font size="0">Group ID that SDR node belongs</font></td>
    </tr>
    <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">SDR Node Type</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">4</font></td>
        <td style="white-space: pre;"><font size="0">4: SDR Broadcast only Node <br>6: SDR Node that support Private Data Exchange</font></td>
    </tr>
    <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1 - 251</font></td>
        <td><font size="0">SDR Private Data length</font></td>
    </tr>    
    <tr>
        <td><font size="0">8</font></td>
        <td><font size="0">Data</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">byte array</font></td>
        <td><font size="0">SDR Private Data</font></td>
    </tr>
</table>

Response: 

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
        <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">6</font></td>
        <td><font size="0">Command Id for "SDR Private Data Exchange"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Virtaul ID</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">unsigned long</font></td>
        <td><font size="0">Virtual ID of SDR node</font></td>
    </tr>
    <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">Group ID</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">unsigned char</font></td>
        <td><font size="0">Group ID that SDR node belongs</font></td>
    </tr>
    <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">SDR Node Type</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">6</font></td>
        <td style="white-space: pre;"><font size="0">4: SDR Broadcast only Node <br>6: SDR Node that support Private Data Exchange</font></td>
    </tr>
    </tr>
        <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Result</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">16bits unsigned integer</font></td>
        <td><font size="0">Command Error Code</font></td>
    </tr>
</table>

Example:

> *//Send data "00 01" to SDR node [0x01, 0x01, 0x06]<br>→06 01 00 00 00 01 06 02 00 01*

> *//Command completes successfully<br>←06 01 00 00 00 01 06 00 00

7. ### BLE Connection

TBD

8. ### BLE GATT Service Discovery

TBD

9. ### BLE GATT Read

TBD

10. ### BLE GATT Write

TBD

## Event Description

When scanning, due to high-capacity nodes that gateway supports and limited resources of 612L, SDR Broadcast Report and BLE Advertising Report are dispatched in a structured manner, where the data frame is of a fixed size of 39 bytes. In this context:

- An SDR broadcast signifies a method by which a software-defined radio sends information.

- A BLE advertisement indicates that a Bluetooth Low Energy device is publicly broadcasting data, often for discovery by other devices.

For this notification, if payload of an SDR broadcast or BLE advertisement exceeds 31 bytes, scanner will discard the rest and hense the payload is not complete.

During private data exchange, transceivers are devices that both transmit and receive data. In this context, Transceiver event may be either data from given SDR node when engaged in SDR Private Data Exchange or BLE GATT Notification Data from BLE connectable peripheral.

1. ### SDR Broadcast Report

The SDR Broadcast Report is an event in which the Scanner notifies the system when it captures an SDR broadcast. The detailed information about this broadcast is tabulated in the format mentioned, which includes the event ID, virtual ID of the SDR node, the group ID of the SDR node, etc. The event example demonstrates the structure in which the data is presented.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Event Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0x64</font></td>
        <td><font size="0">Event Id for "SDR Broadcast Report"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Virtaul ID</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">unsigned long</font></td>
        <td><font size="0">Virtual ID of SDR node</font></td>
    </tr>
    <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">Group ID</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">unsigned char</font></td>
        <td><font size="0">Group ID that SDR node belongs</font></td>
    </tr>
    <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">SDR Node Type</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">4</font></td>
        <td style="white-space: pre;"><font size="0">4: SDR Broadcast only Node <br>6: SDR Node that support Private Data Exchange</font></td>
    </tr>
    <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Time Stamp</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">unsigned short</font></td>
        <td><font size="0">Time stamp in 10ms unit when SDR broadcast is captured</font></td>
    </tr>
    <tr>
        <td><font size="0">9</font></td>
        <td><font size="0">RSSI</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">signed char</font></td>
        <td><font size="0">Received Signal Strength Indicator in dBm</font></td>
    </tr>
    <tr>
        <td><font size="0">10</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1 - 27</font></td>
        <td><font size="0">SDR broadcast payload length</font></td>
    </tr>    
    <tr>
        <td><font size="0">11</font></td>
        <td><font size="0">Payload</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">byte array</font></td>
        <td><font size="0">SDR broadcast payload</font></td>
    </tr>
</table>

Example:

> *//SDR Broadcast from node [0x44,0x01,0x04], RSSI is 0xB6 (-74dBm), payload "D4 0A"<br>
←64 44 00 00 00 01 04 51 86 B6 02 D4 0A 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00*

2. ### BLE Advertising Report

The BLE Advertising Report is an event when the Scanner captures a BLE advertisement. Information related to this event includes the event ID, BLE Mac Address, timestamp of the event, Received Signal Strength Indicator (RSSI), and other relevant data. An example to depict this structure is also provided.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Event Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0x65</font></td>
        <td><font size="0">Event Id for "BLE Advertising Report"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">MAC Adddress</font></td>
        <td><font size="0">6</font></td>
        <td><font size="0">-</font></td>
        <td><font size="0">MAC Address of BLE advertiser (Beacon)</font></td>
    </tr>
    <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Time Stamp</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">unsigned short</font></td>
        <td><font size="0">Time stamp in 10ms unit when advertisement is captured</font></td>
    </tr>
    <tr>
        <td><font size="0">9</font></td>
        <td><font size="0">RSSI</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">signed char</font></td>
        <td><font size="0">Received Signal Strength Indicator in dBm</font></td>
    </tr>
    <tr>
        <td><font size="0">10</font></td>
        <td><font size="0">Flag</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">-</font></td>
        <td>
            <table>
                <tr><td><font size="0">Bit 7:1</font></td> <td><font size="0">Reserved</font></td></tr>
                <tr><td><font size="0">Bit 0</font></td> <td style="white-space: pre;"><font size="0">0: Non-connectable<br>1: Connectable</font></td></tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td><font size="0">11</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">1 - 27</font></td>
        <td><font size="0">BLE advertisement payload length</font></td>
    </tr>    
    <tr>
        <td><font size="0">12</font></td>
        <td><font size="0">Payload</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">byte array</font></td>
        <td><font size="0">BLE advertisement payload</font></td>
    </tr>
</table>

Example:

> *BLE advertising from 00:01:02:03:04:AB, RSSI is 0xAC (-84dBm), payload "07 09 49 6E 50 6C 61 79"<br>
←65 AB 04 03 02 01 00 94 C1 AC 01 07 09 49 6E 50 6C 61 79 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00*

3. ### SDR Private Data Reception

The SDR Private Data Reception event signifies the reception of data directly from given SDR node. This event captures the essence of the data being transmitted from given SDR node that support private data exchange, which include details such as the virtual ID, group ID, type of SDR node, and the data itself. The accompanying example provides clarity on the data structured representation.

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Event Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0x66</font></td>
        <td><font size="0">Event Id for "SDR Private Data Recepiton"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">Virtaul ID</font></td>
        <td><font size="0">4</font></td>
        <td><font size="0">unsigned long</font></td>
        <td><font size="0">Virtual ID of SDR node</font></td>
    </tr>
    <tr>
        <td><font size="0">5</font></td>
        <td><font size="0">Group ID</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">unsigned char</font></td>
        <td><font size="0">Group ID that SDR node belongs</font></td>
    </tr>
    <tr>
        <td><font size="0">6</font></td>
        <td><font size="0">SDR Node Type</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">6</font></td>
        <td style="white-space: pre;"><font size="0">4: SDR Broadcast only Node (Beacon)<br>6: SDR Node that support Private Data Exchange</font></td>
    </tr>
    <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">unsigned char</font></td>
        <td><font size="0">Data Length</font></td>
    </tr>
    <tr>
        <td><font size="0">8</font></td>
        <td><font size="0">Data</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">byte array</font></td>
        <td><font size="0">Data</font></td>
    </tr>
</table>

Example:

> *//SDR private data reception from node [0x44,0x01,0x06], data "D4 0A"<br>←66 44 00 00 00 01 06 02 D4 0A*

4. ### BLE Data Reception

The BLE Data Reception is an event where the Transceiver receives data from BLE connectable node via GATT notification/indication method. The specifics of this event encapsulate the event ID, BLE peripheral's MAC Address, and the data length received, along with the actual data payload. An example is provided to elucidate the structured format of the received data.

Event: 

<table width="100%" border="0">
    <tr>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">OFFSET</font></th>
        <th width="20%" align="center" bgcolor="#cccccc"><font size="1">NAME</font></th>
        <th width="1%" align="center" bgcolor="#cccccc"><font size="1">LENGTH</font></th>
        <th width="10%" align="center" bgcolor="#cccccc"><font size="1">VALUE</font></th>
        <th width="58%" align="center" bgcolor="#cccccc"><font size="1">NOTE</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Event Id</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0x67</font></td>
        <td><font size="0">Event Id for "BLE Data Recepiton"</font></td>
    </tr>
    <tr>
        <td><font size="0">1</font></td>
        <td><font size="0">BLE MAC Address</font></td>
        <td><font size="0">6</font></td>
        <td><font size="0">-</font></td>
        <td><font size="0">MAC address of peer BLE peripheral</font></td>
    </tr>
    <tr>
        <td><font size="0">7</font></td>
        <td><font size="0">Handle</font></td>
        <td><font size="0">2</font></td>
        <td><font size="0">unsigned short</font></td>
        <td><font size="0">Handle of GATT characteristic that notify or indicate</font></td>
    </tr>
    <tr>
        <td><font size="0">9</font></td>
        <td><font size="0">Len</font></td>
        <td><font size="0">1</font></td>
        <td><font size="0">0 - 255</font></td>
        <td><font size="0">Data length</font></td>
    </tr>
    <tr>
        <td><font size="0">10</font></td>
        <td><font size="0">Data</font></td>
        <td><font size="0">&lt;Len&gt;</font></td>
        <td><font size="0">byte array</font></td>
        <td><font size="0">Data</font></td>
    </tr>
</table>

Example:

> *//BLE notify data from 11:22:33:44:55:66, handle is 0x0010, data is "D4 0A".<br>←67 66 55 44 33 22 11 10 00 02 D4 0A*

## Error Code

The error codes serve as a standardized way of communicating issues or successes between a device or system and its user or another system. Recognizing and understanding these codes can assist in diagnosing problems, troubleshooting, and ensuring smoother operations.

<table width="100%" border="0">
    <tr>
        <th width="30%" align="center" bgcolor="#cccccc"><font size="1">Error Code</font></th>
        <th width="70%" align="center" bgcolor="#cccccc"><font size="1">Description</font></th>
    </tr>
    <tr>
        <td><font size="0">0</font></td>
        <td><font size="0">Command was executed correctly</font></td>
    </tr>
    <tr>
        <td><font size="0">0x1001</font></td>
        <td><font size="0">Command was executed with error</font></td>
    </tr>
    <tr>
        <td><font size="0">0x0111</font></td>
        <td><font size="0">Not Ready</font></td>
    </tr>
    <tr>
        <td><font size="0">0x100A</font></td>
        <td><font size="0">Error Command ID</font></td>
    </tr>
    <tr>
        <td><font size="0">0x100B</font></td>
        <td><font size="0">Error Busy</font></td>
    </tr>
    <tr>
        <td><font size="0">0x100D</font></td>
        <td><font size="0">Error Parameter</font></td>
    </tr>
    <tr>
        <td><font size="0">0x100E</font></td>
        <td><font size="0">Error Timeout</font></td>
    </tr>
    <tr>
        <td><font size="0">Others</font></td>
        <td><font size="0">BLE error</font></td>
    </tr>
</table>

