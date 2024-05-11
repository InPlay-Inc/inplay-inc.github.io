---
title: "SDR Broadcast Sample"
---

# SDR Broadcast Sample

## Overview

SDR (Software Defined Radio) exhibits significant advantages in communication systems, especially in building flexible and multifunctional wireless communication networks. 
The Master device typically plays a central role in control and management, while multiple Slave devices serve as nodes performing specific communication tasks.



## Hardware Requirements

| Hardware  | Project Name                                                 | Project Path                                                 |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| IN628E DK | proj_SDR_Broadcast_Mode_Master proj_SDR_Broadcast_Mode_Slave | in-dev/proj/SDR/proj_SDR_Broadcast_Mode_Master in-dev/proj/SDR/proj_SDR_Broadcast_Mode_Slave |

## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to Uart Log. The following are samples,

- **SDR TX success** `[TX]actual tx bytes=%d`

- **SDR RX success** ` "[RX]sa:0x%04x, da:0x%04x, status:%02x, ch=%d, rssi=%d, rxlen=%d,"`


More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps
**Master**

1. Open Keil and download **proj_SDR_Broadcast_Mode_Master**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts sdr broadcast process according to the settings in `sdr_mstr_trx_t`.
- In broadcast mode, master don't receive.

**Slave**

1. Open Keil and download **proj_SDR_Broadcast_Mode_Slave**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts sdr addressless process according to the settings in `sdr_slv_trx_t`.
3. When sdr communication astablished, we will receive log like `[TX]actual tx bytes=%d`and `[RX]sa:0x%04x, da:0x%04x, status:%02x, ch=%d, rssi=%d, rxlen=%d,`