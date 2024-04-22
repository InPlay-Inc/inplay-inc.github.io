# GPIO Wake Example Guide

## Overview

The GPIO wake-up feature is a functionality that allows a chip to be awakened from a low-power mode by configuring a GPIO pin. When certain predetermined wake-up conditions are met, a change in the state of the GPIO pin triggers the chip to transition from a sleep or idle state to normal operation.



## Hardware Requirements

| Hardware  | Project Name      | Project Path                         |
| --------- | ----------------- | ------------------------------------ |
| IN628E DK | proj_drv_gpio_wuk | in-dev/proj/driver/proj_drv_gpio_wuk |



## Configuration

```c
#define PORT 1 // wake up port
#define PIN 3 // wake up pin
```

Define the GPIO reset port and pin.



```c
#define WUP_TRIGGER FALLING_EDGE // wake up source
```

Define the triggering of a GPIO wake signal, it can be either on the rising edge or the falling edge, depending on the system design and requirements.  The following enum is the mode can be chosen

```
enum{
	HIGH,
	LOW,
	RISING_EDGE,
	FALLING_EDGE,
	BOTH_EDGE,
};
```



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio to Uart Log and LED. The following are samples,

- **Power down:** `power down `

- **Wake up:**`power up src=23`. number 23 means wake-up source, we can find its meaning in `pm_ws`.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.




## Testing Steps

1. Open Keil and select the GPIO wake-up pin and edge, then download **proj_drv_gpio_wuk**.
2. Press the reset button and observe the log for the message `CHIP ID =`.
3. Input signal in set pin, we can find that development board  wake up successfully.

