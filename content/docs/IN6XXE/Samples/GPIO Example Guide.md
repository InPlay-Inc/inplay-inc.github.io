# GPIO Example Guide

## Overview

GPIO is one of the essential hardware interfaces in microcontrollers. It enables beginners to better understand the hardware structure and basic principles of microcontrollers. 

In this example, we can achieve basic input and output functionality using GPIO.



## Hardware Requirements

| Hardware  | Project Name  | Project Path                     |
| --------- | ------------- | -------------------------------- |
| IN628E DK | proj_drv_gpio | in-dev/proj/driver/proj_drv_gpio |



## Configuration

```c
#define LED1_PORT 2
#define LED1_PORT 8
```

Define the GPIO output port and pin for LED.



```c
#define KEY_PORT 2
#define KEY_PIN 3
```

Define the GPIO input port and pin.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio to Uart Log and LED. The following are samples,

- LED cycle flashing
- when the  GPIO_2_3 put up, the message `KEY up` will be printed.

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Testing Steps

1. Open Keil and select the GPIO output pin and input pin, then download **proj_drv_GPIO**.
2. Press the reset button and observe the log for the message `CHIP ID =`.
3. Repeat the LED on/off cycle. If the GPIO input pin is high, the message `KEY up` will be printed.