---
title: "BLE GATT Sample"
---

# BLE GATT Sample

## Overview

GATT (Generic Attribute Profile) is a protocol introduced in Bluetooth that defines the communication rules between Bluetooth devices. It enables different types of Bluetooth devices to communicate and exchange data efficiently, particularly in Bluetooth Low Energy (BLE) devices such as smart bracelets, watches, and health monitoring devices.



## Hardware Requirements

| Hardware  | Project Name                              | Project Path                                              |
| --------- | ----------------------------------------- | --------------------------------------------------------- |
| IN628E DK | proj_ble_gatt_service&proj_ble_gatt_write | in-dev/proj/BLE/proj_ble_gatt_service&proj_ble_gatt_write |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of both central and peripheral according to Uart Log. The following are samples, 

### Central

- **start initiation process** `start init`
- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`
- **disconnect** `*** Disconnect ***, reason=...`
- **Receive data** `TRX RX: len=...`

### Peripheral

- **start advertising process** `start advertising`
- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`
- **disconnect** `*** Disconnect ***, reason=...`
- **Receive data** `TRX RX: len=...`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference)  page.



## Test Steps

- **Central**

1. Download and run the **proj_ble_gatt_write** project.

2. The Bluetooth device initiates a connection request.

3. After a successful connection, central would enable peripheral notification and we can view the address information of the Bluetooth device on the Terminal Emulator.

4. The Bluetooth device sends a write request to the development board periodically.

   

- **Peripheral**

1. Download and run the **proj_ble_gatt_service** project.
2. The Bluetooth device starts advertising.
3. After a successful connection, we can view the address information of the Bluetooth device on the Terminal Emulator.
4. The Bluetooth device sends a notify request to the development board periodically.

   