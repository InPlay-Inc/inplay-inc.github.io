---
title: "Timer Sample"
---

# Timer Sample

## Overview

TIMER is a type of timer that allows timing operations within a microcontroller. By setting the count value and timing period of the TIMER, we can control the timing operations of the microcontroller, enabling features such as timed tasks and timestamp generation.

This routine demonstrates the functionality of configuring and handling callbacks using TIMER. It provides a brief overview of the usage of various functions, including TIMER configuration and functionality.



## Hardware Requirements

| Hardware  | Project Name   | Project Path                      |
| --------- | -------------- | --------------------------------- |
| IN628E DK | proj_drv_timer | in-dev/proj/driver/proj_drv_timer |



## Configuration

```
#define TEST_CASE         SIMPLE_TIMER_ONCE
```

After displaying "Select a number to test:" on the log, you can input a number between 0 and 2 to select a mode, including:



```
enum
{
	SIMPLE_TIMER_ONCE = 0,
	SIMPLE_TIMER_RELOAD,
	TIMER_EMIT,
	TIMER_CAPTURE,
	TIMER_MANUAL,
};	
```

SIMPLE_TIMER_ONCE: Start the timer and print "tmr_cb" after a timeout.

SIMPLE_TIMER_RELOAD: Start the timer and continuously print "tmr_cb".

TIMER_EMIT: Start the timer and continuously emit Signal 2 on GPIO_2_7, Signal 3 on GPIO_2_8, and toggle Signal 1 on GPIO_2_2.

TIMER_CAPTURE: Start the timer and continuously capture the signal on GPIO_0_3.

TIMER_MANUAL: Start the timer in manual mode, where it counts down each time the corresponding register is written.



```
#define TMR_ID            TMR0_ID
```

Select the TMR ID to be used. This configuration is only effective for SIMPLE_TIMER_ONCE and SIMPLE_TIMER_RELOAD in the TEST CASE.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of gpio to Uart Log.

- **SIMPLE_TIMER_ONCE:** Start the timer and print "tmr_cb" after a timeout.

- **SIMPLE_TIMER_RELOAD:** Start the timer and continuously print "tmr_cb".

- **TIMER_EMIT:** Start the timer and continuously emit Signal 2 on GPIO_2_7, Signal 3 on GPIO_2_8, and toggle Signal 1 on GPIO_2_2.

- **TIMER_CAPTURE:** Start the timer and continuously capture the signal on GPIO_0_3.

- **TIMER_MANUAL:** Start the timer in manual mode, where it counts down each time the corresponding register is written.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.



## Test Steps

1. Open Keil and download the project.
2. Press the reset button and observe the text `test case: %d` on the log, where %d represents the selected mode.

- Simple Timer Example:
  1. Depending on whether it is RELOAD or not, the callback may or may not appear repeatedly. If it is ONCE, it will stop after `tmr cb`.
- Emit & Capture:
  1. Two IN628E boards are required for testing. Download the emit program to Board 1 and the capture program to Board 2.
  2. After downloading, connect the signal pins (GPIO_2_7, GPIO_2_8, or GPIO_2_2) of Board 1 to the receiving signal pin (GPIO_0_3) of Board 2.
  3. Reset both boards simultaneously to receive signals on Board 2.




