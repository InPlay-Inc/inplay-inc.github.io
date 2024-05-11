---
title: "PWM Sample"
---

# PWM Sample

## Overview

PWM (Pulse Width Modulation) is a technique used to control the output voltage or current by adjusting the ratio of high and low levels of a signal. The higher the ratio of high level time to the entire period, the higher the output voltage or current.

This routine demonstrates the generation of square wave signals using PWM. It can generate square wave signals with a specific period and duty cycle based on the selected PORT and PIN.



## Hardware Requirements

| Hardware  | Project Name | Project Path                    |
| --------- | ------------ | ------------------------------- |
| IN628E DK | proj_drv_pwm | in-dev/proj/driver/proj_drv_pwm |



## Configuration

```
#define PWM0_PERIOD_USEC 10000    
```

Define the PWM period for PWM0.



```
#define PWM0_HIGH_USEC   5000 
```

Define the duration of the high level for PWM0.



```
#define PWM4_PERIOD_USEC 10000 
```

Define the PWM period for PWM4.



```
#define PWM4_HIGH_USEC   3000   
```

Define the duration of the high level for PWM4.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of development board according to terminal emulator.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps

1. Open Keil and download the project.
2. Press the reset button and observe the text "input any key to pause PWM" appearing in the log. This indicates that the PWM has started.
3. Use a logic analyzer or an oscilloscope to connect to GPIO_0_0 (pwm0) and GPIO_1_8 (pwm4) to observe the corresponding square waves with the specified period and duty cycle.