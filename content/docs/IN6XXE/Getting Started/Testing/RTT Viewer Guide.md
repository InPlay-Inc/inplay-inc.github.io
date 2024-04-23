# RTT Viewer Guide

## Introduction

J-Link RTT Viewer is a Windows GUI application that uses RTT functionality on the debugging host. RTT Viewer can be used independently, opening its own connection to the J-Link and connecting in parallel to the target of the ongoing debugging session or alternatively to it using an existing J-Link connection. The RTT Viewer supports the main functions of RTT:

1. Terminal output on channel 
2. Sending text input to channel
3. Up to 16 virtual terminals with only one target channel
4. Controlling text output
5. Recording data on channel



## Configuration

### Install Jlink

Should setup **in-dev\tools\ InPlayToolsSetup.exe**, get more information in [JFlash Programming Guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/jflash-download-guide.html)

### Config in in_config Config Tool

 ![configuration](/images/rtt-viewer01.png)



## Usage

- **Auto Detection**

  Choose **IN6XX** in Target Device

   ![](/images/rtt-viewer02.png)

  Click OK to see the Log

   ![](/images/rtt-viewer03.png)

- **Manual Detection**

  Choose **IN6XX** in Target Device, and press <kbd>Address</kbd> , enter .map document(located in ) and search for address of \_SEGGER\_RTT. 

  ![](/images/rtt-viewer04.png)

  Input the address in the blank.

  ![](/images/rtt-viewer05.png)

  

  Note: 

  When the chip is reset or enters sleep mode, JLink will disconnect. When the chip is running again, you need to click Connect to reconnect before the log is displayed.

  ![](/images/rtt-viewer06.png)

