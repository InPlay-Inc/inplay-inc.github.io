---
title: "BLE Keyboard Sample"
---

# BLE Keyboard Sample

## Overview

Bluetooth is widely used in wireless mouse and keyboard, this is an example for chip to plays a role of keyboard using bluetooth. 



## Hardware Requirements

| Hardware  | Project Name      | Project Path                            |
| --------- | ----------------- | --------------------------------------- |
| IN628E DK | proj_ble_Keyboard | in-dev/proj/BLE_no_os/proj_ble_Keyboard |



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to Uart Log. The following are samples,

- **start advertising process** `start advertising`
- **connection established** ` "ble_connect  Connect  ... intv:... lantency:... timeout:... clock:..."`
- **disconnect** `*** Disconnect ***, reason=...`
- **send keyboard command** `report idx=0`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference)  page.



## Test Steps

1. Open Keil and download **proj_ble_Keyboard**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts advertising according to the settings in in_config.h.
3. We can search for the device with the corresponding address on a Bluetooth device. Connect to the device and **send bond request** to the device. After that, we will get keyboard information `a` for 3 seconds.