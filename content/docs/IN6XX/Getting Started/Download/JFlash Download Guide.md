---
title: "JFlash Programming"
---

# JFlash Programming Guide

## Introduction
This document provides a guide on how to use J-Flash to download bin file to the IN6XX chip. 

J-Flash is a part of the J-Link tool series developed by Segger, offers a reliable solution for programming Flash memory on embedded systems.

## Prerequisites

1. J-Link Debugger hardware.Get it on [Segger web site](https://shop.segger.com/debug-trace-probes/debug-probes/j-link/j-link-base-classic).
2. [J-Link Software and Documentation Pack](https://www.segger.com/downloads/jlink/#J-LinkSoftwareAndDocumentationPack) installed on your host computer(Version 7.62 or later is recommended).
	

## JLinkDevices  Configuration
### Windows
- **Install InPlayTools(recommended)**:

	InPlayTools is an extension designed to enhance J-Flash functionality by adding support for the IN6XX series of chips.

	The installation file for Inplaytools is in "SDK\in-dev\tools\InPlayToolsSetup.exe", or download [InPlayTools](https://raw.githubusercontent.com/InPlay-Inc/IN6XX-Tools/main/InPlayTool/InPlayToolsSetup.exe) from website.

	User should select the Jlink version. Recommended install Jlink Version 7.62 or later first.


![](/images/jflash0.png)


## Downlaod Step:
- Open JFlash, and select “create a new project.”

![](/images/jflash1.png)

- Select the target device
![](/images/jflash2.png)

- Select InPlay IN6XX_C0_GIGA device
![](/images/c0-jflash1.png)

- Open the Bin file

Click the file menu, select “Open data file”, and select the Bin file to be downloaded.
![](/images/jflash4.png)

- Set start address
  Set start address to 0x300000.
  ![](/images/jflash5.png)


- Connect to device
  ![](/images/jflash6.png)

- Download bin file
  ![](/images/jflash7.png)

Note:

Make sure that the chip is in boot mode before downloading.

For entering boot mode, please press boot pin then reset chip.