---
title: "IR Sample"
---
# IR  Sample

## Overview

IR,short for infrared. The IR module realizes the infrared transmitting and receiving function based on the counter module.External infrared transmitting and receiving circuits are required.


## Hardware Requirements

| Hardware  | Project Name | Project Path                    |
| --------- | ------------ | ------------------------------- |
| IN628E DK | proj_drv_ir | in-dev/proj/driver/proj_drv_ir |



## Configuration

```c
#define APP_IR_CNT_ID CNT0_ID
```
Define the counter ID.

```c 
#define FUNC  IR_TX  // IR_TX_REPEAT  IR_RX  IR_FREQ
```
Define the test mode.




## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.


## Test Steps

- **IR_TX**
  1. Open Keil and set #define FUNC  IR_TX, download proj_drv_ir.
  2. Press reset button and observe the text "IR Test Case: IR_TX start" appear in the log.
  3. The waveform can be captured from the TX pin. The length of the wafeform is finite.

- **IR_TX_REPEAT**
  1. Open Keil and set #define FUNC  IR_TX_REPEAT, download proj_drv_ir.
  2. Press reset button and observe the text "IR Test Case: IR_TX_REPEAT start" appear in the log.
  3. The waveform can be captured from the TX pin. The wareform repeats indefinitely.
  
- **IR_RX**
  1. Open Keil and set #define FUNC  IR_RX, download proj_drv_ir.
  2. Press reset button and observe the text "IR Test Case: IR_RX start" appear in the log.
  3. In IR_RX mode, a fixed IR clock will used to receive waveform data. The log includes waveform data.

- **IR_FREQ**
  1. Open Keil and set #define FUNC  IR_FREQ, download proj_drv_ir.
  2. Press reset button and observe the text "IR Test Case: IR_FREQ start" appear in the log.
  3. In IR_FREQ mode , chip will automatically detect the IR clock then receive waveform data. The log includes a data string (waveform data).