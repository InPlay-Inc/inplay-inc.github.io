# BLE Transparent Transmission Guide

## Overview

In Bluetooth data transparent transmission, the sending device packages the raw data into Bluetooth data packets and sends them to the receiving device through the Bluetooth connection. After receiving these data packets, the receiving device can directly read and parse the raw data without any decoding or processing.



## Hardware Requirements

| Hardware  | Project Name                      | Project Path                                      |
| --------- | --------------------------------- | ------------------------------------------------- |
| IN628E DK | proj_ble_trx_clt&proj_ble_trx_svc | in-dev/proj/BLE/proj_ble_trx_clt&proj_ble_trx_svc |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of both central and peripheral according to Uart Log. The following are samples, 

### Central

- **start scan process** `Scan start`

- **start initiation process** `start init`
- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`
- **disconnect** `*** Disconnect ***, reason=...`
- **Receive data** `TRX RX: len=...`

### Peripheral

- **start advertising process** `start advertising`
- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`
- **disconnect** `*** Disconnect ***, reason=...`
- **Receive data** `TRX RX: len=...`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/samples/Debug-Guide) page.



## Test Steps

- **Using a Single Development Board**

1. Download and run the **proj_ble_trx_svc** project.
2. The development board starts Bluetooth broadcasting, allowing the Bluetooth device to search and find the broadcast data.
3. The Bluetooth device initiates a connection request.
4. After a successful connection, we can view the address information of the Bluetooth device on the Terminal Emulator.
5. The Bluetooth device sends a write request to the development board.
6. The developer inputs data on the Terminal Emulator and sends it. The development board transmits data to the Bluetooth device, which will display the same data content upon receiving it.

- **Using Two Development Boards**

1. Central downloads the **proj_ble_trx_clt**, while Peripheral downloads the **proj_ble_trx_svc**.
2. Reset Central device and Peripheral device.
3. Peripheral development board starts Bluetooth broadcasting, allowing Central to search and find the broadcast data.
4. Central initiates a connection request.
5. After a successful connection, we can view the address information of the other party on Uart log.
6. On the client side of the Uart, input data and send it. The client sends a write request to the server, and the server receives the same data.
7. The developer on the Peripheral side inputs data and sends it. Peripheral transmits data to the Central, which will display the same data content upon receiving it.