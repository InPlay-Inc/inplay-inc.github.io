---
title: "Quick Start"
---

# Quick Start Guide
## Introduction
This document provides a guide as following:
- Install development tools
- Use the configuration tool
- Build "proj_ble_find_my" demo project
- Download image to DK

## Preparation
- InPlay DK Board
- JLink Debugger
- InPlay SDK
- Usb cable.

## Install Tools
- Download and install [MDK-ARM Keil µVision](https://www.keil.com/demo/eval/arm.htm) (Version 5.21 or later is recommended). 

- Download and install [J-Link Software and Documentation Pack](https://www.segger.com/downloads/jlink/#J-LinkSoftwareAndDocumentationPack)(Version 7.62 or later is recommended).

- Install InPlayInc.DeviceFamilyPack. Double click the InPlayInc.DeviceFamilyPack installation package under the directory of "in-dev\tools", or download [InPlayInc.DeviceFamilyPack](https://github.com/InPlay-Inc/IN6XX-Tools/blob/main/Keil_Pack/InPlayInc.DeviceFamilyPack.1.0.6.pack) from website. 

## Generate configuration File (optional)
Demo projects are in "SDK/in-dev/proj". Each project has a configuration file named "in_config.h". This file is located in the "inc" directory of the project. This file is genareted by "InPlay SwiftConfig Tool". If you want to modify the default configuration file, use this tool that is located in "in-dev/tools/in_config".

1. Run [InPlay SwiftConfig Tool](https://github.com/InPlay-Inc/IN6XX-Tools/blob/main/SwiftConfigTool/in_config.exe).
2. Click "Open" button, open the configuration file in "in-dev/proj/ble/proj_ble_find_my/inc/in_config.h". 
3. Modify project configuration.
4. Click "Save" button, save the configuration file to "in-dev/proj/ble/proj_ble_find_my/inc/in_config.h"

## Build the Project
1. Open the Keil project, double click file "in-dev/proj/ble/proj_ble_find_my/build/mdk/proj_ble_lp.uvmpw". "\*.uvprojx" is Keil single project file, and "\*.uvmpw" is Keil multi project file. Here we use multi project file.

Noted:
If you encounter errors indicating that project files such as "hw\_ana" and "ble\_flash" cannot be found, please ignore them. These projects are library project. And SDK inlcudes prebuild library files.

2. Click "Batch Build" button. Select all projects and click "Rebuild."

## Download to DK board

1. Connect JLink debugger to DK board. And power up DK board.
   
2. Click "Project" menu in Keil, and select "Options for target"(or use shortcut key Alt+F7).
3. Click "Device" tab, and select "IN6XXE" device under "InPlay Inc".
   ![](/images/c0-quickstart01.png)
4. Click "Debug" tab, and select "J-Link" from the drop-down menu, as shown below:
   ![](/images/quickstart00.png)
5. If a devices selection window pops up, select the "unspecified Cortex M4".  
   ![](/images/quickstart01.png) 
6. Then click "Settings" tab,  select "SW" (single-wire interface) from the drop-down menu of "Port." The click "OK" to apply changes.

Note:

If the J-Link is connected to the DK board and DK board is powered up, KEIL should detect DK board and display its information in the "SW Device" column, as illustrated below. If Keil can't find device, reset DK and click "Scan" to rescan device.

![](/images/quickstart02.png) 

7. If Keil displays the following warning dialog, please click the OK button and then select Cortex-M4 on the next page.
![](/images/quickstart06.png) 
![](/images/quickstart07.png) 

8. In the "Utilities" tab, click  "Settings". If the Keil Pack is installed, configuration will be done automatically as follows.
   ![](/images/c0-quickstart02.png) 
   If Keil is not configured properly, please manually add the "IN602C0 GD25WD40C SPI FLASH "flm file by click "Add" button. Then set start addres to 0x210000 and set size to 0x1000.
9.  Click "OK" to apply changes.

10. Click "download" button to download image file to DK board.
![](/images/c0-quickstart05.png) 







