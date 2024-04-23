---
title: "BLE Initiation Sample"
---

# Ble Initiation Sample


## Overview 

The Bluetooth connection initiation mode refers to the method utilized by a Bluetooth device to proactively initiate a connection with other devices. Within Bluetooth communication, there are typically two connection modes: Central and Peripheral. The Central mode represents the party that takes the initiative in establishing the connection, whereas the Peripheral mode signifies the party that passively accepts the connection.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Hardware Requirements

| Hardware                                    |  Project Name  | Project Path                  |
| ------------------------------------------- |  ------------- | ----------------------------- |
| IN628E DK | proj_ble_init | in-dev/proj/BLE/proj_ble_init |



## Debug

We can get the status of development board according to Uart Log. The following are samples,

### Central

- **start initiation process** `start init`

- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`

- **disconnect** `*** Disconnect ***, reason=...`

### Peripheral

- **start advertising process** `start advertising`

- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`

- **disconnect** `*** Disconnect ***, reason=...`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

1. Open Keil and download **proj_ble_init** (Central), and on another development board, download **proj_ble_adv_conn** (Peripheral).

2. Press the reset button on the central board and the peripheral board, observe the text `CHIP ID =` appear in the log, and begin scanning based on the settings in **in_config.h**.

3. When scanning for devices with the Peripheral address, the Central will initiate a connection request to the Peripheral, and the Peripheral will accept the connection request, establishing a Bluetooth connection.


