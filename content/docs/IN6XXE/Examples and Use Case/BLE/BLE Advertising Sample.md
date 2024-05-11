---
title: "BLE advertising Sample"
---

# BLE Advertising Sample

## Overview

Bluetooth advertising is based on the transmission of advertising packets. An advertising packet is a small amount of data that contains device identifiers and other relevant information. The transmission of advertising packets is connectionless, meaning that it does not require pairing or connection operations before establishing a Bluetooth connection.



## Hardware Requirements

| Hardware  | Project Name      | Project Path                      |
| --------- | ----------------- | --------------------------------- |
| IN628E DK | proj_ble_adv_conn | in-dev/proj/BLE/proj_ble_adv_conn |



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to Uart Log. The following are samples,

- **start advertising process** `start advertising`

- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`

- **disconnect** `*** Disconnect ***, reason=...`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference)  page.



## Test Steps

1. Open Keil and download **proj_ble_adv_conn**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts advertising according to the settings in in_config.h.
3. We can search for the device with the corresponding address on a Bluetooth device. If we have two development boards, we can download the proj_ble_init project on another board. The board with proj_ble_init can automatically connect to the board with proj_ble_adv_conn.