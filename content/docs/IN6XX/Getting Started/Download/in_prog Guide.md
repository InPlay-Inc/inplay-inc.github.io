---
title: "InPlay Programmer Guide"
---

# InPlay Programmer Guide

## Introduction
The [InPlay Programmer](https://github.com/InPlay-Inc/IN6XX-Tools/blob/main/inplay_programmer/inplay_programmer.zip) is a graphical chip configuration and programming tool for the PC that enables developers to configure and download programs to target boards using InPlay chips via UART. Developers should refer to the chip datasheet to thoroughly understand the configuration options based on their specific application requirements.

The main window of the GUI tool, as shown in Figure 1, is organized into five primary sections:

1. Data communication interface selection and configuration area
2. Application download area
3. HCI program configuration area
4. Register/eFuse read-write area
5. Efuse configuration area
6. Authentication and encryption configuration area

![](/images/in_prog01.png)

## UART Download
### Prerequisites

1. Connect the DK board’s UART port to the PC.
2. Set the chip to boot mode.

#### Boot Mode
- The chip has two modes: boot mode and normal mode. In boot mode, it can be configured and programmed via UART/JLink, while in normal mode, the chip runs the program already downloaded to it.
- A GPIO pin can be configured as the boot pin in software, and the chip will check the GPIO level at power-on to determine whether to enter boot mode. In the SDK's demo project, **GPIO2-6** is set as the default boot pin.
- If the chip has no loaded program (i.e., a blank chip), it will automatically enter boot mode on power-up.
- If a program is already loaded, ground the boot pin and then power cycle or reset the chip to enter boot mode.

### Connecting to the UART (Area 1)
1. Click on "Uart" in area 1 to automatically scan for UART ports on the PC.
2. Select the DK board’s port from the dropdown list under "Port."
3. The program sets the baud rate to **115200** by default.
4. Click **Connect**. If the connection is successful, a dialog will appear. The program will continue attempting to connect for up to five minutes. To cancel, close and reopen the program.
![](/images/in_prog02.png)

### Program Download (Area 2)
1. Ensure that **BootRAM** is checked in area 2.
2. Click **Browse** to select the application binary file.
3. Verify the **Address** is set to **0x300000**. The program will automatically calculate the size; no adjustments are needed.
4. Click **Download**. A dialog will appear upon successful download.
![](/images/in_prog03.png)
![](/images/in_prog04.png)

### Data File Download
Some programs may require downloading data files, such as calibration data or tokens/UUIDs, to specific locations. This step can be done after downloading the application binary file. 
**Note**: 
If no program has been downloaded previously, data files cannot be downloaded directly.

1. Uncheck **Bootram**.
2. Click **Browse** to select the binary file containing the data.
3. Set the **Addr** as required; for example, to load data at 0x37E000, set the address to **37E000**.
4. **Size** will be set automatically, but it can be adjusted as needed.
5. Click **Download**.
![](/images/in_prog05.png)

### Troubleshooting
- **DK board’s UART port not listed**:
    - Uncheck UART, then re-check it to rescan for UART ports.
- **Connection fails upon clicking Connect**:
    - Ensure the port is not occupied by another program.
- **No success dialog after clicking Connect**:
    - Verify the selected port is correct.
    - Confirm that the chip is in boot mode.
- **Download fails upon clicking Download**:
    - Ensure the correct binary file is selected.
    - Verify **Bootram** is checked.
    - Confirm **Addr** and **Size** settings are correct.
- **Data file download fails upon clicking Download**:
    - Verify the correct binary file is selected.
    - Ensure **Bootram** is unchecked.
    - Confirm **Addr** and **Size** settings are correct.
