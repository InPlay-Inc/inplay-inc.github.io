# GPIO Wake Interrupt Example Guide

## Overview

GPIO interrupt and wake-up are two important features in embedded systems. GPIO interrupt allows a microcontroller to respond to a change in the state of a GPIO pin without continuously checking it, reducing power consumption. Wake-up allows a sleeping microcontroller to quickly respond to an external event, such as a GPIO pin change, without consuming continuous power. When used together, these features improve power efficiency in applications such as battery-powered devices and IoT.



## Hardware Requirements

| Hardware  | Project Name                | Project Path                                   |
| --------- | --------------------------- | ---------------------------------------------- |
| IN628E DK | proj_drv_gpio_wuk_interrupt | in-dev/proj/driver/proj_drv_gpio_wuk_interrupt |



## Configuration



```c
#define PORT 2
#define PIN 3
```

Define the port and pin for testing GPIO wake-up and interrupts.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio according to Uart Log. The following are samples,

- **gpio interrupt occur** `interrupt occur`

- **Wake up** `power up src=`

- Power down `power down`

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.

  

## Test Steps

1. Open Keil and select the GPIO wake-up and interrupt pin. Download the **proj_drv_gpio_wuk_interrupt** project.
2. Press the reset button and observe the log for the text `CHIP ID =`.
3. Toggle the light on and off. When the corresponding edge signal is detected on the GPIO input pin, `power up src=`and`interrupt occur` will be printed.

