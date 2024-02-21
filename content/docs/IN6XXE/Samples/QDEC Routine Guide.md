# QDEC Routine Guide

## Overview

QDEC, short for Quantization Decoder, is a tool used to decode quantized data. It is commonly used in embedded systems to decode quantized data for implementing specific functionalities on microcontrollers.

This routine demonstrates the counting function of a rotary encoder using qdec. It can count based on the events and direction of the rotary encoder (increasing the count for a forward rotation and decreasing the count for a reverse rotation).

The LOG is printed through the UART port, showing the count changes based on the events and direction of the rotary encoder.



## Hardware Requirements

| Hardware  | Project Name  | Project Path                     |
| --------- | ------------- | -------------------------------- |
| IN628E DK | proj_drv_qdec | in-dev/proj/driver/proj_drv_qdec |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

The LOG is printed through the UART port, showing the count changes based on the events and direction of the rotary encoder.

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/samples/Debug-Guide) page.



## Connection

Connect the VCC and GND of IN6xxE to the qdec board. Then, connect GPIO_1_3 to cha-x-0, GPIO_1_6 to chb-x-0, and GPIO_2_3 to idx-x-0.



## Test Steps

1. Open Keil and download the **proj_drv_qdec** project.
2. Press the K1 button and observe the text `main start...` appearing in the log.
3. Rotate the rotary encoder in the forward direction. The count will increase, and the text `cnt is 0x...` will be displayed.

Note: Connecting GP13 to chb_x_0 and GP16 to cha_x_0 will not affect the program's operation but will change the direction determination during the rotary encoder rotation.