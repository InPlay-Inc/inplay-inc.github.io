---
title: "HCI Sample"
---

# HCI Sample

## Overview

HCI, as the Host Controller Interface, is a crucial component of the Bluetooth protocol stack. This interface lies within the hardware section of the Bluetooth communication module, providing a standardized communication mechanism between the host and controller elements of a Bluetooth device.



## Hardware Requirements

| Hardware  | Project Name                              | Project Path                                                 |
| --------- | ----------------------------------------- | ------------------------------------------------------------ |
| IN628E DK | proj_ate_test_hci proj_ate_test_hci_no_os | in-dev/proj/misc/proj_ate_test_hci in-dev/proj/misc/proj_ate_test_hci_no_os |



## Configuration

```c
#define EXT_PA 0 ///< 0: diable external PA, 1: enable external PA
```
Define if use PA control. 0: diable external PA, 1: enable external PA

```c
#define BIAS_PORT 1 ///< external PA bias port
#define BIAS_PIN 3  ///< external PA bias pin
```
Define the Bias pin. If don't use Bias pin, set it to 0xff

```c
#define TX_EN_PORT 1 ///< external PA TX EN port
#define TX_EN_PIN  4 ///< external PA TX EN pin
```
Define the Tx_en pin.

```c
#define RX_EN_PORT 2 ///< external PA RX EN port
#define RX_EN_PIN  3 ///< external PA RX EN pin
```

Define the Rx_en pin.



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can enter command on GPIO_2_7, and get the status on GPIO_2_1. **Remember to set hex send and receive when testing HCI command.**The following are samples: 

- **command sent:**  `01030c00`

- **status received:** `04 0E 04 01 03 0C 00`

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/debug-guide) page. More information and command can be found in [HCI Command](https://inplay-inc.github.io/docs/in6xxe/getting-started/hci_command)

  

## Test Steps

  1. Open Keil and set `EXT_PA` to be 1 if needed, download proj_ate_test_hci_no_os.
  2. Press reset button and observe the text "main start" appear in the log.
  3. Send HCI command and we can get status on UART1.

