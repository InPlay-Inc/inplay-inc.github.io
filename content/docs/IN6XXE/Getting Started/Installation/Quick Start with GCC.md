---
title: "Quick Start with GCC"
---

# Quick Start Guide with GCC
## Introduction
This document introduce how to use GCC for software development.

## Preparation
- InPlay DK Board
- JLink Debugger
- InPlay SDK
- Usb cable.

## Install Tools
- Download and install [Arm GNU Toolchain](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads) (version "arm-gnu-toolchain-13.2.rel1-x86_64-arm-none-eabi" is recommended). 

- Install Make
```
	sudo apt-get update
	sudo apt-get install build-essential
```


## Generate configuration File (optional)
Demo projects are in "SDK/in-dev/proj". Each project has a configuration file named "in_config.h". This file is located in the "inc" directory of the project. This file is genareted by "InPlay SwiftConfig Tool". If you want to modify the default configuration file, use this tool that is located in "in-dev/tools/in_config".

1. Run [InPlay SwiftConfig Tool](https://github.com/InPlay-Inc/IN6XXE-Tools/blob/main/SwiftConfigTool/in_config.exe). Use [Wine](https://www.winehq.org/) to run it on Linux. 
2. Click "Open" button, open the configuration file in "in-dev/proj/ble/proj_ble_adv_conn/inc/in_config.h". 
3. Modify project configuration.
4. Click "Save" button, save the configuration file to "in-dev/proj/ble/proj_ble_adv_conn/inc/in_config.h"

## Build the Project
1. Unzip InPlay SDK to "~/inplay".
2. Open file "~/inplay/in-dev/proj/common/gcc/linux.mk". Set "GNU_INSTALL_ROOT" to your GCC installation path.
3. Build project "proj_ble_adv_conn".
```
	cd ~/inplay/in-dev/proj/ble/proj_ble_adv_conn/build/gcc/
	make all
```
4. Use the following command to rebuild project:
```
	make cleanall
	make all
```	








