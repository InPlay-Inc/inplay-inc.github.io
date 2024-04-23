---
title: "SPI Sample"
---

# SPI Sample

## Overview

SPI (Serial Peripheral Interface) communication is a synchronous serial transmission specification typically used for communication between microprocessing control units (MCUs) and peripheral devices. This communication method is characterized by its high speed, full-duplex, and synchronous nature, achieving data transmission through four wires (MISO, MOSI, SCLK, CS/SS) on chip pins.

SPI communication consists of a master device and one or more slave devices. The master device initiates synchronized communication with the slave devices to complete data exchange. During the communication process, the master device configures and generates clock signals, which are used to synchronize data transmission. Each clock cycle transmits one bit of data, so the speed of data transmission is determined by the frequency of the clock signal.



## Hardware Requirements

| Hardware  | Project Name | Project Path                                                 |
| --------- | ------------ | ------------------------------------------------------------ |
| IN628E DK | proj_drv_SPI | in-dev/proj/driver/proj_drv_SPI_master in-dev/proj/driver/proj_drv_SPI_slave |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of both master and slave according to Uart Log and LED.

- When we transmit or receive data, we can get information on uart log.

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

- Master Setup and Download
  1. Open **proj_drv_SPI_master**, compile, and download the project.
  2. Press the reset button.
- Slave Setup and Download
  1. Open **proj_drv_SPI_slave**, compile, and download the project.
  2. Press the reset button.
- Testing
  1. Reset the slave first, then reset the master. We can see the data appearing in the LOG based on the selected mode of the master.
  2. master exchange data with slave.
  3. Each time the SPI master and slave receive data, the values range from 0x00 to 0xFF.