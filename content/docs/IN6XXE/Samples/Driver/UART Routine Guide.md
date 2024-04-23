---
title: "UART Sample"
---

# UART Sample

## Overview

UART is a common serial communication protocol used for serial communication between microcontrollers and other devices. UART communication is a simple and effective method of communication, which can be used for data transmission between microcontrollers and sensors or for debugging and configuration between microcontrollers and other devices.

In this routine, we can achieve sending data, receiving data, and RTS/CTS flow control through UART APIs.



## Hardware Requirements

| Hardware  | Project Name  | Project Path                     |
| --------- | ------------- | -------------------------------- |
| IN628E DK | proj_drv_UART | in-dev/proj/driver/proj_drv_UART |



## Configuration

```
#define MODE 2
```

Change the operating mode by replacing the number 2 with 0, 1, or 2.

0 is POLL mode, 1 is INTR mode, and 2 is DMA mode.

```
#define EN_FLOW_CTRL 0
```

0 indicates disabled flow control, 1 indicates enabled flow control.

```
#define UART_BAUDRATE 115200
```

Set the baud rate for UART.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get information simply on UART log.

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

- Without Flow Control
  1. Open Keil and download the project.
  2. Press the reset button and observe the text "use poll mode" on the log, where "poll" represents the selected mode.
  3. Input some characters in the input box and press "Send". We receive the content that was just sent.
- With Flow Control
  1. Use the in_config tool to open the inc/in_config.h file in the corresponding project folder, check GPIO 1-5 and GPIO 1-6 under the peripheral section for MUX1, and connect them to CTS and RTS, respectively. Save the changes and open Keil to download the project.
  2. Open the debugger, check RTS or other flow control switches, and observe the text "use DMA mode" on the log, where "DMA" represents the selected mode.
  3. Input some characters in the input box and press "Send". We receive the content that was just sent.