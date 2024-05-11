---
title: "I2C Sample"
---

# I2C Sample

## Overview

I2C (Inter-Integrated Circuit) is a common embedded communication protocol that allows high-speed bidirectional communication between microcontrollers and other devices. The bus is the physical channel for I2C communication and consists of two lines: a serial clock line (SCL) for transmitting clock signals and a serial data line (SDA) for transmitting data.

This routine demonstrates the sending and receiving of data between I2C Master and I2C Slave using I2C communication. It enables serial communication of data between different development boards. The UART port prints the LOG, showing the data transmission and retrieval between the I2C Master and I2C Slave.



## Hardware Requirements

| Hardware  | Project Name | Project Path                    |
| --------- | ------------ | ------------------------------- |
| IN628E DK | proj_drv_I2C | in-dev/proj/driver/proj_drv_I2C |



## Configuration

```c
#define TEST_CASE I2C_TEST_MASTER_XFER_BLOCKING_READ
```

You can change the operation mode.

### Available modes for Master

1. I2C_TEST_MASTER_XFER_BLOCKING_READ
2. I2C_TEST_MASTER_XFER_BLOCKING_DMA_READ
3. I2C_TEST_MASTER_XFER_POLL_READ
4. I2C_TEST_MASTER_XFER_BLOCKING_WRITE
5. I2C_TEST_MASTER_XFER_BLOCKING_DMA_WRITE
6. I2C_TEST_MASTER_XFER_POLL_WRITE
7. I2C_TEST_MASTER_XFER_BLOCKING_WRITE_READ
8. I2C_TEST_MASTER_XFER_BLOCKING_DMA_WRITE_READ
9. I2C_TEST_MASTER_XFER_POLL_WRITE_READ
10. I2C_TEST_MASTER_XFER_ASYNC

### Slave mode

1. I2C_TEST_SLAVE_XFER



```c
#define I2C_SLAVE_ADDR  0x14
```

Set the address of the slave device in I2C communication.



```c
#define I2C_SPEED I2C_SPEED_100K
```

Set the speed of the I2C communication.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of both master and slave according to Uart Log and LED.

- When we transmit or receive data, we can get information on uart log.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps

- Master Setup and Download
  1. Open Keil, change the selected mode to master, compile, and download the project.
  2. Press the reset button and observe the LOG to see the text "master_xfer_blocking_read dma_en=0", which represents the selected mode.
- Slave Setup and Download
  1. Open Keil, change the selected mode to slave, compile, and download the project.
  2. Press the reset button and observe the LOG to see the text which represents the selected mode., 
- Testing
  1. Reset the slave first, then reset the master. We can see the data appearing in the LOG based on the selected mode of the master.
  2. After resetting both the slave and the master, we can observe the data appearing in the LOG based on the selected mode of the master.