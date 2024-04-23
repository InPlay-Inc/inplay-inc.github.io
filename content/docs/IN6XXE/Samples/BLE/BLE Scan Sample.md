---
title: "BLE Scan Sample"
---

# Bluetooth Scan Sample

## Overview

In Bluetooth Low Energy (BLE), scanning is the process where a BLE central device (such as a smartphone or a BLE-enabled gateway) actively searches and listens for advertising packets from nearby BLE peripheral devices. The scanning process allows the central device to discover and connect to nearby peripherals. 



## Hardware Requirements

| Hardware  | Project Name  | Project Path                  |
| --------- | ------------- | ----------------------------- |
| IN628E DK | proj_ble_scan | in-dev/proj/BLE/proj_ble_scan |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to Uart Log. The following are samples,

- **start scan process:** `start scan`
- **get advertising data from other BLE device:** `*** ADV DATA FROM...*** ` , `...`means the address of other device. 

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

1. Open Keil and download **proj_ble_scan**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts advertising according to the settings in in_config.h.
3. After device scanning start, we can get advertising data from other BLE device.