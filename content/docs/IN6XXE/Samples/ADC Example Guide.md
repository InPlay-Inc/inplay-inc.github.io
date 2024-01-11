# ADC Example Guide

## Overview

ADC, short for Analog-to-Digital Converter, is a key component in embedded systems. It is used to convert an analog signal, such as a voltage or current, into a digital value that can be processed by the microcontroller or processor in the embedded system. This allows the system to interact with the physical world by taking measurements from sensors or other analog devices. The accuracy and resolution of the ADC are important factors in determining the overall performance of the embedded system.



## Hardware Requirements

| Hardware  | Project Name | Project Path                 |
| --------- | ------------ | ---------------------------- |
| IN628E DK | proj_drv_adc | in-dev/proj/BLE/proj_drv_adc |



## Configuration

```c
#define FORCE_MODE 1 //0: auto mode, 1: force mode
```
Define whether choose force mode or not.

```c
#define FORCE_MODE_SAMPLE_NUM 16
#define AUTO_MODE_SAMPLE_NUM 16
```
Define the sample num in adc test.

```c
#define DISCARD_NUM 0 ///< skip adc sample number
```
Define the sample num need to be discarded.

```c
#define CH_NUM 4
```

Define the adc test total channel num.



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of sample value, test content and value according to UART Log. The following are samples: `VBAT ch:14 =0xab3 3294.8mV`,

- **test content:**  `VBAT/Temperature/...`

- **chosen channel:** `ch:...`

- **measurement value:** `=0x...`

- **converted value**: here is `3294,8mV`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/samples/Debug-Guide) page.

  

## Test Steps

- **force mode**
  1. Open Keil and set `FORCE_MODE` to be 1, download proj_drv_adc.
  2. Press reset button and observe the text "main start" appear in the log.
  3. On UART log, there will be text like "VBAT ch:14 =0xab3 3294.8mV".

- **auto mode**
  1. Open Keil and set `FORCE_MODE` to be 0, download proj_drv_adc.
  2. Press reset button and observe the text "main start" appear in the log.
  3. On UART log, there will be text like "VBAT ch:14 =0xab3 3294.8mV".