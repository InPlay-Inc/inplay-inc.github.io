---
title: "GPIO Interrupt Sample"
---

# GPIO Interrupt Sample

## Overview

GPIO interrupts are signals that are sent to the processor when there is a change in the state of a GPIO pin. This allows the processor to immediately respond to the change and perform a specific task or function. These interrupts are commonly used in embedded systems and microcontrollers to efficiently manage input and output devices.



## Hardware Requirements

| Hardware   | Project Name                       | Project Path                               |
| --------- | ----------------------- | -------------------------------------------- |
| IN628E DK | proj_drv_gpio_interrupt | in-dev/proj/driver/proj_drv_gpio_interrupt |



## Configuration



```c
#define GPIO_INTERRUPT_PORT 1
#define GPIO_INTERRUPT_PIN 3
```

Define the port and pin for testing GPIO interrupts.



```c
#define GPIO_INTERRUPT_EDGE RISE_EDGE
```

Define the edge-trigger signal for GPIO interrupts, including RISE_EDGE and FALL_EDGE. RISE_EDGE represents an interrupt when the GPIO input has a rising edge, while FALL_EDGE represents an interrupt when the GPIO input has a falling edge.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio according to Uart Log. The following are samples,

- **gpio interrupt occur** `rise:... fall:... wup:...` mains the gpio interrupt source.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps

1. Open Keil and select the GPIO interrupt pin. Download the **proj_drv_gpio_interrupt** project.
2. Press the reset button and observe the log for the text `CHIP ID =`.
3. Toggle the light on and off. When the corresponding edge signal is detected on the GPIO input pin, `rise:... fall:... wup:...` will be printed.

- In this example, due to the presence of the mask function in the callback, the interrupt will only be triggered once.