---
title: "SDR 1 to n Sample"
---

# SDR 1 to n Sample

## Overview

SDR (Software Defined Radio) exhibits significant advantages in communication systems, especially in building flexible and multifunctional wireless communication networks. 
In SDR broadcast systems, signal processing and transmission are both accomplished through software. This allows SDR broadcast equipment to support multiple modulation methods, coding techniques, and transmission protocols, thus achieving compatibility with various broadcast standards. Whether it's the high-quality audio transmission of high-definition broadcasting or the extensive coverage of digital audio broadcasting, SDR delivers excellent performance.



## Hardware Requirements

| Hardware  | Project Name                                                 | Project Path                                                 |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| IN628E DK | proj_SDR_1_mst_to_N_slave_master proj_SDR_1_mst_to_N_slave_slave | in-dev/proj/SDR/proj_SDR_1_mst_to_N_slave_master in-dev/proj/SDR/proj_SDR_1_mst_to_N_slave_slave |

## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to Uart Log. The following are samples,

- **SDR TX success** `[TX]actual tx bytes=%d`

- **SDR RX success** ` "[RX]sa:0x%04x, da:0x%04x, status:%02x, ch=%d, rssi=%d, rxlen=%d,"`


More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps
**MASTER**

1. Open Keil and download **proj_SDR_1_mst_to_N_slave_master **.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts sdr master process according to the settings in `sdr_mstr_trx_t`.
3. When the development board received , we will receive log like `[TX]actual tx bytes=%d` and  `[RX]sa:0x%04x, da:0x%04x, status:%02x, ch=%d, rssi=%d, rxlen=%d,`

**SLAVE**

1. Open Keil and download **proj_SDR_1_mst_to_N_slave_slave**.
2. Press the reset button and observe the text `CHIP ID =` on the log while the device starts sdr slave process according to the settings in `sdr_slv_trx_t`.
3. When the development board received , we will receive log like `[TX]actual tx bytes=%d`  and `[RX]sa:0x%04x, da:0x%04x, status:%02x, ch=%d, rssi=%d, rxlen=%d,`