---
title: "Trigger Sample"
---

# Trigger Sample

## Overview

Trigger is a mechanism that initiates specific operations or events. It can be implemented through hardware or software, converting external signals or events into actionable operations, such as activating sensors, controlling tasks, or initiating communication. Triggers are essential for the system to respond to external conditions and perform necessary actions.



## Hardware Requirements

| Hardware  | Project Name  | Project Path                     |
| --------- | ------------- | -------------------------------- |
| IN628E DK | proj_drv_trig | in-dev/proj/driver/proj_drv_trig |



## Configuration

```c
#define TRIG_QUEUE TRIG_HIGH_PRI_QUEUE //TRIG_LOW_PRI_QUEUE, TRIG_MID_PRI_QUEUE, TRIG_HIGH_PRI_QUEUE
```
define the priority of trigger. Three types of priority can be chosen, TRIG_LOW_PRI_QUEUE, TRIG_MID_PRI_QUEUE, TRIG_HIGH_PRI_QUEUE.

```c
#define OUTPUT_PORT 0
#define OUTPUT_PIN 1
```
define the output pin.

```c
#define TIRG_COND_PORT 0
#define TIRG_COND_PIN 3
```
define the trigger  condition pin.

```c
#define DEBUG_PORT 0
#define DEBUG_PIN 4
```
define the debug pin.

```c
#define TEST_OUTPUT_CMD 0 //test output
#define TEST_REG_WR_CMD 0 //test register write
#define TEST_TIMER_CMD 1 //test set timer and wait timer
#define TEST_REG_CP_CMD 0 //test compare the value in register
#define TEST_REG_MASK_CP_CMD 0 //test mask compare the value in register
#define TEST_REG_RW_CMD 0 //test register read and write
#define TEST_RD_CMP_CMD_WAIT 0 // //test read and compare the value in register(wait)
#define TEST_RD_CMP_CMD_NO_WAIT 0 //test read and compare the value in register(not wait)
```

Change the operation mode.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.




## Debug

We can get the trigger interrupt status on UART log.

- **TEST_OUTPUT_CMD**

  When TRIG_CON_PIN experiences a rising edge or a falling edge, it will output a high or low voltage level on the output pin based on whether it's a rising or falling edge.

- **TEST_REG_WR_CMD**

  When TRIG_CON_PIN experiences a rising edge or a falling edge, value set will be written to register.

- **TEST_TIMER_CMD**
  When TRIG_CON_PIN experiences a rising edge or a falling edge, timer will be set, start and then stop.

- **TEST_REG_CP_CMD**
  When TRIG_CON_PIN experiences a rising edge or a falling edge, copy 4 bytes from source address to destination address.

- **TEST_REG_MASK_CP_CMD**
  When TRIG_CON_PIN experiences a rising edge or a falling edge, copy 4 bytes from source address to destination address with mask.

- **TEST_REG_RW_CMD**

  When TRIG_CON_PIN experiences a rising edge or a falling edge, read and write the register.

- **TEST_RD_CMP_CMD_WAIT**


  When TRIG_CON_PIN experiences a rising edge or a falling edge,  compare the value in register with the expected value. 

- **TEST_RD_CMP_CMD_NO_WAIT**

  When TRIG_CON_PIN experiences a rising edge or a falling edge,  compare the value in register with the expected value.

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page.

  ​     

## Test Steps

1. Open Keil and select the desired functionality, then download proj_drv_trig.
2. Press the K1 button and observe the text "main start" appearing in the log.
3. When the trigger pin is triggered, you will see something like "irq 0x5" in Figure 1-1, where 5 represents the status. At the same time, the corresponding functionality will be implemented based on the selected option.