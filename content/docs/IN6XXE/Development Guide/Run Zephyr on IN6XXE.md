---
title: "Run Zephyr on IN6XXE"
---

## Introduction

Zephyr is an open source RTOS maintained by the Linux foundation, which is designed for connected, resource-constrained embedded devices. It provides a scalable and secure platform for developing IoT and embedded applications.

Inplay has added support including BLE for Zephyr on IN6XXE chips. If you have an IN6XXE DK board(Refer to [Introduction to IN6XXE DK]({{<ref "docs/IN6XXE/Getting Started/Introduction to IN6XXE DK.md">}})), you can run Zephyr BLE samples on it with this guide.

## Setup a Zephyr development environment under Windows
It is recommended to develop Zephyr on IN6XXE under Windows. You can follow [Zephyr Getting Started Guide](https://docs.zephyrproject.org/latest/develop/getting_started/index.html) to setup a Zephyr development environment under Windows, it can be divided into following steps:

**1.Install host dependencies, including cmake, Python, devicetree compiler, etc.**

These are necessary host tools needed to build Zephyr.

**2.Install west and Python dependencies**

Because IN6XXE support is not merged into the official Zephyr project repository now, you should init west using below command:
```
west init -m https://github.com/InPlay-Inc/zephyr zephyrproject
```

To support IN6XXE, an external module named "[hal_inplay](https://github.com/InPlay-Inc/hal_inplay)" is added, when you run `west update`, it will be cloned to your zephyr working directory automatically.

**3.Install Zephyr SDK**

You only need to install arm-zephyr-eabi cross tool to support IN6XXE.


## Build the application
Board name of IN6XXE is 'inplaydk_in612le', you can start with a simple "blinky" sample:
```
cd zephyrproject/zephyr
west build -p always -b inplaydk_in612le samples/basic/blinky
```

## Flash binary output
You should first refer to [JFlash Download Guide]({{< ref "docs/IN6XXE/Getting Started/JFlash Download Guide.md">}}) to install InplayTools. After that, you can use Jlink to burn the binary output to the on-chip flash with command `west flash`.

## Run the sample
For the DK board, UART1 is configured as console in the source code, and the baud rate is 115200. 
There is an USB to UART chip(CH340) integrated on the board which is connected to UART1(GPIO21 as Tx, and GPIO27 as Rx), so you only need to connect the board to PC with USB Type-C cable to see logs or use shell. CH340 drivers should be installed first, you can download it from [here](https://sparks.gogo.co.nz/ch340.html). If the sample runs normally, you can see logs output to a serial terminal software like "putty".

## Supported drivers
Only these drivers are supported now:
- GPIO
- pinctrl(partially implemented)
- UART(support tx and rx with interrupt, so you can use Zephyr shell)
- BLE hci driver
