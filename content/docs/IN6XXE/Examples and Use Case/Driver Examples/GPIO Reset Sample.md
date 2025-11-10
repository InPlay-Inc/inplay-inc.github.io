---
title: "GPIO Reset Sample"
---

# GPIO Reset Sample

## Overview

Triggering chip reset through GPIO involves controlling a GPIO pin to perform a hardware reset on the chip. When the state of the GPIO pin changes, it triggers a reset on the chip, restoring it to its initial state. This method is commonly used in embedded systems for system rebooting, fault recovery, or initialization under specific conditions. By configuring and changing the state of the GPIO pin, the chip reset can be flexibly controlled and managed.



## Hardware Requirements

| Hardware   | Project Name                       | Project Path                                                     |
| --------- | ----------------------  | --------------------------------------- |
| IN628E DK | proj_drv_gpio_reset  | in-dev/proj/driver/proj_drv_gpio_reset |



## Configuration

```c
#define GPIO_RESET_TEST_PORT 1
#define GPIO_RESET_TEST_PIN 3
```

Define the GPIO reset port and pin.



```c
#define RESET_EDGE RISING_EDGE
```

Define the triggering of a GPIO reset signal, it can be either on the rising edge or the falling edge, depending on the system design and requirements. 1 means rising edge, 0 means falling edge.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio to Uart Log. The following are samples,

- **Waiting for reset signals:** `Input pin is GPIO1_3 Wait for falling edge to trigger PD1 reset `

- **reset success:**`CHIP ID = ...`

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.

  

## Testing Steps

1. Open Keil and select the GPIO reset pin and edge, then download **proj_drv_gpio_reset**.
2. Press the reset button and observe the log for the message `CHIP ID =`.
3. Input signal in set pin, we can find that we reset development board suceess.