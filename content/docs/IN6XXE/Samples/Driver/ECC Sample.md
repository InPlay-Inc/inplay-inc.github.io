---
title: "ECC Sample"
---

# ECC Sample


## Overview 

ECC (Error Correction Code) is an encoding technology used for detecting and correcting errors in data transmission. It is currently one of the more advanced methods for checking and correcting memory errors, making computer systems safer and more stable during operation.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Hardware Requirements

| Hardware                                    |  Project Name  | Project Path                  |
| ------------------------------------------- |  ------------- | ----------------------------- |
| IN628E DK | proj_drv_ECC | in-dev/proj/drv/proj_drv_ECC |



## Debug

We can get the status of development board according to Uart Log. The following are samples,

-  **verify success**: `Verify OK`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

1. Open Keil and download **proj_drv_ECC**

2. Press the reset button on the board and the peripheral board, observe the text `CHIP ID =` appear in the log.

3. Verify the data using ECC. If verify success, text `Verify OK` will appear in the log.


