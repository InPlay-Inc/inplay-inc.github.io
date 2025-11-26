---
title: "InPlay Programmer V3 Guide"
---

# InPlay Programmer V3 User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Interface Overview](#user-interface-overview)
4. [Application Modes](#application-modes)
5. [Connection Setup](#connection-setup)
6. [Download Tab](#download-tab)
7. [Secure Tab](#secure-tab)
8. [Debug Tab](#debug-tab)
9. [Efuse Setting Tab](#efuse-setting-tab)
10. [Image Setting Tab](#image-setting-tab)
11. [Common Workflows](#common-workflows)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

**InPlay Programmer** is a professional firmware programming tool designed for InPlay IN6XX and IN6XXE series chips. It provides a modern, intuitive interface for firmware downloading, chip configuration, security management, and debugging operations.

### Supported Chip Types
- IN602A2
- IN602C0
- IN602F1

### Key Features
- Firmware programming via UART or JLink interface
- Secure firmware download with encryption
- EFUSE configuration and management
- Debug operations (register read/write, flash erase)
- Cryptographic key management
- Firmware signature generation and verification
- Custom firmware image creation

---

## Getting Started

### System Requirements
- Windows/Linux/macOS
- Available serial port (for UART mode) or JLink probe (for JLink mode)
- Install InPlayTools(for JLink download)


### First Launch
On first launch, the application will:
- Create necessary configuration files
- Set up the logging directory
- Initialize default settings

---

## User Interface Overview

The InPlay Programmer interface consists of four main areas:

### 1. Left Sidebar (Navigation)
- Application title and version
- Tab navigation buttons

### 2. Main Content Area
- Tab-specific content and controls
- File selection and configuration options
- Operation buttons and status display

### 3. Right Interface Panel
- Interface selection (UART/JLink)
- Connection configuration
- Connect/Disconnect controls
- Connection status display

### 4. Title Bar
- Window controls (Minimize, Maximize, Close)
- Mode toggle (Normal/Expert)
- Drag area for window movement

---

## Application Modes

InPlay Programmer offers two operating modes to suit different user needs:

### Normal Mode
**Best for:** Basic firmware programming tasks

**Available Tabs:**
- Download
- Secure Setting

**Use When:**
- Performing standard firmware programming
- Basic security operations

### Expert Mode
**Best for:** Advanced development and debugging

**Available Tabs:**
- Download
- Secure
- Debug
- Efuse Setting
- Image Setting

**Use When:**
- Chip configuration
- EFUSE programming
- Debugging
- Custom firmware image creation

**Switching Modes:**
Click the mode toggle in the left sidebar to switch between Normal and Expert mode.

---

## Connection Setup

### Step 1: Select Interface

Choose your connection interface based on available hardware:

#### UART Interface (Serial Port)
- **Advantages:** Widely available, works with standard USB-to-serial adapters
- **Supports:** All security features, verification, encrypted downloads

#### JLink Interface (Debug Probe)
- **Advantages:** Faster programming, hardware-level reliability, full chip erase
- **Limitations:** No RAM/Flash secure, no verification (not needed)

### Step 2: Configure Connection Parameters

#### For UART:
1. **Port:** Select the COM port from the dropdown
   - Check Device Manager (Windows) or `ls /dev/tty*` (Linux/macOS) for available ports

2. **Baud Rate:** Select communication speed
   - **115200** (default, recommended for most cases)
   - Higher rates (230400, 460800, 921600, 2000000) for faster downloads
   - Lower rates (9600-57600) for problematic connections

#### For JLink:
1. **Probe:** Select your JLink device from the dropdown
   - Click "Refresh Probes" to rescan for devices

2. **Speed:** Set the SWD/JTAG communication speed
   - Default: 4000 kHz
   - Lower for long cables or unstable connections

3. **Transport Mode:**
   - **SWD** (Serial Wire Debug) - default, 2-wire interface
   - **JTAG** - 4-wire interface

4. **Halt CPU:** Check to halt the CPU after connection
   - Useful for debugging
   - Uncheck for normal programming

### Step 3: Connect

1. Click the **Connect** button
2. Wait for connection establishment
3. Status will show the detected chip type (e.g., "Connected: IN602A2")
4. The button will change to **Disconnect** (red)

**Connection Indicators:**
- **Blue Button:** Ready to connect
- **Orange Button:** Connection in progress (click to cancel)
- **Red Button:** Connected (click to disconnect)

---

## Download Tab

The Download tab is the primary interface for programming firmware to your chip.

### Firmware File Selection

1. Click **Browse** next to the Application or User Data field
2. Select your firmware binary file (.bin)
3. The firmware information panel will automatically display file details

### Firmware Information Panel

After selecting a file, the following information is displayed:

- **Chip Type:** Target chip (IN602A2/C0/F1)
- **OTA Header:** Indicates if OTA header is present
- **SW Version:** Software version
- **HW Version:** Hardware version
- **Boot Option:** Boot configuration (Normal/Wait/GPIO Boot)
- **Boot Pin:** GPIO pin configuration for GPIO boot mode
- **App Flash Addr:** Application flash address (F1 chips only)

**Warning:** If the firmware chip type doesn't match your connected chip, a warning banner will appear. Ensure you're using the correct firmware file.

### Download Modes

#### Application Mode
- **Purpose:** Program main firmware to flash memory
- **Default Address:** 0x300000
- **Use For:** Standard firmware updates, initial programming

#### User Data Mode
- **Purpose:** Program custom data to user area
- **Address:** Configurable
- **Use For:** Configuration data, calibration values, custom payloads

### Security Options (UART Only)

#### Ram Secure
- **Function:** Download firmware with RAM secure(AES encyption, code/data decyption to RAM)
- **Requirements:** Burn Efuse ram secure bit

#### Flash Secure
- **Function:** Download encrypted firmware to flash memory
- **Requirements:** Burn Efuse flash encrypt bit

#### Verify
- **Function:** Read back and verify downloaded firmware
- **Use When:** Ensuring download integrity, production testing
- **Note:** Adds time to download process

### Download Configuration

1. **Address:** Target flash address (hexadecimal)
   - Default: `0x300000`
   - Must be aligned to 4 bytes
   - Verify with your memory map

2. **Size:** Download size in bytes
   - Auto-calculated from file size
   - Manually adjustable if needed

### Performing a Download

1. **Connect** to your chip
2. **Select firmware file** (Application or User Data)
3. **Review firmware information** for correctness
4. **Configure security options** (if needed)
5. **Verify address and size** settings
6. Click **Download** button
7. **Monitor progress bar** (0-100%)
8. **Check status messages** for completion or errors

**Progress Indicators:**
- Progress bar shows download percentage
- Status message shows current operation

**After Download:**
- Success message will appear
- Firmware is ready to execute
- You can disconnect or perform additional operations

---

## Secure Tab

The Secure tab manages cryptographic keys, firmware signatures, and security features.

### Key Management

#### Private Key
- **Display:** Shows loaded private key
- **Load Key:** Click to browse and load a private key file
- **Use For:** Host authentication, signature generation

#### Public Key
- **Display:** Shows public key
- **Sources:**
  - Derived from loaded private key
  - Read from EFUSE memory
- **Use For:** Firmware verification, authentication

#### Reading Public Key from EFUSE

1. Click **Read Public Key from EFUSE**
2. The public key will be retrieved from chip memory (EFUSE words 8-15)
3. Display will update with the read key
4. Use for verification against expected key

**Note:** Public key in EFUSE is permanent once written.

### Host Authentication

Host authentication proves to the chip that you have the correct private key.

**To Authenticate:**
1. **Load your private key** using the "Load Key" button
2. **Connect** to the chip
3. Click **Auth**
4. Wait for result dialog:
   - **Success:** Authentication passed
   - **Failure:** Check private and public key
**Note:** If the private key is already loaded, authentication will be performed automatically.

**Troubleshooting Authentication:**
- **Public Key Mismatch:** Dialog will appear if EFUSE public key doesn't match loaded public key
- **Connection Required:** Must be connected to chip
- **Key Required:** Must load correct private/public key first

### Signature Generation

Generate ECDSA signatures for secure boot.

#### Configuration

1. **Image File:** Browse and select firmware binary
2. **Hash Start Address:** Starting address for hash calculation
   - Default: `0x304000`
   - Hexadecimal format

3. **Hash Total Size:** Number of bytes to include in hash
   - Default: `0x0` (auto-calculate from file)
   - Hexadecimal format

#### Generating Signature

1. **Load private key** (if not already loaded)
2. **Select image file** to sign
3. **Configure hash parameters** (optional)
4. Click **Calculate Signature**
5. **Review signature** in display field
6. Click **Save Signature** to export to file

**Use Cases:**
- Secure boot verification
**Note:** Must bure secure boot Efuse bit. Chip will enter to boot mode when don't have correct signature.

### Security Features Display

View current chip security configuration (read-only):

- **Flash Encrypt:** Flash memory encryption enabled/disabled
- **Secure Boot:** Boot signature verification enabled/disabled
- **Ram Secure:** RAM download encryption enabled/disabled
- **Host Authentication:** Authentication requirement enabled/disabled
- **Hash with UUID:** UUID inclusion in hash enabled/disabled

**Note:** These are informational only. Configuration is done in the Efuse Setting tab (Expert mode).

---

## Debug Tab

*Available in Expert Mode only*

The Debug tab provides low-level access to chip registers, EFUSE memory, flash operations, and system control.

### Register Operations

#### Read Register
Read data from any memory address.

1. **Enter address** (hexadecimal, e.g., `0x44110000`)
2. Click **Read Register**
3. **Result appears** in the Data field
4. **Status message** confirms success/failure

**Common Addresses:**
- `0x44110000` - System control registers
- Refer to chip datasheet for memory map

#### Write Register
Write data to any memory address.

1. **Enter address** (hexadecimal)
2. **Enter data** value (hexadecimal)
3. Click **Write Register**
4. **Status message** confirms success/failure

**Caution:** Writing incorrect values can cause chip malfunction. Verify address and data before writing.

### EFUSE Operations

#### Read EFUSE
Read a specific EFUSE word.

1. **Select word** (0-15) from dropdown
2. Click **Read EFUSE**
3. **Data appears** in hex format
4. **Status shows** read result

#### Write EFUSE
Write data to EFUSE word (permanent operation).

1. **Select word** (0-15)
2. **Enter data** (hexadecimal)
3. Click **Write EFUSE**
4. **Confirm** in the warning dialog
5. **Status shows** write result

**WARNING:**
- EFUSE writes are PERMANENT and IRREVERSIBLE
- Cannot change bits from 1 to 0, only 0 to 1
- Use Efuse Setting tab for safer configuration
- When write EFUSE, must connect VDDQ pin to VCC(3.3V)

### Flash Erase

Erase flash memory sectors.

1. **Address:** Enter start address (hexadecimal, e.g., `0x300000`)
2. **Size:** Enter erase size (hexadecimal)
3. Click **Erase**
4. **Wait** for operation to complete
5. **Status shows** result

**Notes:**
- Address must be sector-aligned (typically 4KB sectors)
- Size will be rounded up to sector boundaries
- Erased flash reads as 0xFF
- Support both UART and JLink

### CRC32 Calculation

Calculate CRC32 checksum of memory region.

1. **Address:** Memory region start (default: `0x300000`)
2. **Size:** Number of bytes (default: `0x8000`)
3. **QSPI Offset:** Offset for QSPI flash (default: `0x0`), used for OTA bin.
4. Click **CRC32**
5. **Result displayed** in hex format

**Use For:**
- Verifying flash contents
- Comparing firmware versions
- Data integrity checking

### System Control

#### Global Reset
Restart the chip.

1. Click **Global Reset**
2. **Confirm** in warning dialog
3. Chip will restart
4. You will be disconnected


#### Stop AON WDT
Stop the Always-On Watchdog Timer.

1. Click **Stop AON WDT**
2. Watchdog timer will be disabled

**Use When:**
- Debugging long operations
- Preventing unwanted resets
- Development and testing

**Note:** Watchdog will re-enable on reset.

---

## Efuse Setting Tab

*Available in Expert Mode only*

The Efuse Setting tab provides a user-friendly interface for configuring EFUSE settings without manual hex calculations.

### IMPORTANT: EFUSE Safety

- **All EFUSE writes are PERMANENT**
- **Cannot be reversed or undone**
- **Read current values before writing**
- **Test configuration in firmware first if possible**
- **Backup chip configuration**

### EFUSE Word 0 Configuration

EFUSE Word 0 controls basic chip features and QSPI pin configuration.

#### Vendor Lock
- **Checked:** Lock vendor-specific features


#### External Flash Present
- **Checked:** External QSPI flash is connected


#### No Long Range
- **Checked:** Disable Long Range mode


#### No SDR
- **Checked:** Disable SDR (Single Data Rate)


#### No InPlay MAC
- **Checked:** Disable InPlay Mac


#### QSPI Pin Configuration

Configure QSPI flash pin multiplexing (6×6 grid):

1. **Rows:** QSPI functions (CS, DIO0, DIO1, DIO2, DIO3, CLK)
2. **Columns:** Pin selection (MUX 0-5)
3. **Click cells** to toggle selection (green = selected, red = unselected)
4. **Only one cell per row** can be selected
5. Default configuration typically works for standard layouts

#### TVS (Time Value Select)

Select the TVS timing parameter:
- **Range:** 30 - 10000 microseconds
- **Default:** Varies by chip
- **Use:** Timing calibration

#### Operations

- **Read from EFUSE:** Load current Word 0 values from chip
- **Write to EFUSE:** Save configuration to chip (PERMANENT)

### EFUSE Word 7 (Customer) Configuration

EFUSE Word 7 contains security features and system configuration.

#### Security Features

##### Customer Lock
- **Function:** Lock customer-configurable features
- **Effect:** Prevents further customer modifications


##### JLink Disable
- **Function:** Permanently disable JLink debug access
- **Effect:** Cannot use JLink debugger
- **Warning:** Cannot be re-enabled


##### Flash Encrypt
- **Function:** Enable flash memory encryption
- **Effect:** Flash contents are encrypted/decrypted automatically
- **Use:** Protect firmware from reading

##### Secure Boot
- **Function:** Verify firmware signature before execution
- **Effect:** Only signed firmware will run
- **Requirements:** Public key in EFUSE words 8-15
- **Use:** Prevent unauthorized firmware

##### Ram Secure
- **Function:** Enable RAM secure
- **Effect:** Downlaod AES encrypion data to flash, and chip will decrypt data and copy to RAM
- **Use:** Secure development mode

##### Host Authentication
- **Function:** Require authentication before commands
- **Effect:** Host must prove key ownership
- **Use:** Restrict chip access

##### Hash with UUID
- **Function:** Include chip UUID in signature hash
- **Effect:** Firmware tied to specific chip
- **Use:** Anti-cloning protection

##### SW JLink Disable
- **Function:** Software-level JLink disable
- **Effect:** Disable JLink in bootloader


##### ISP Disable
- **Function:** Disable In-System Programming
- **Effect:** Cannot reprogram via bootloader
- **Warning:** Irreversible
- **Use:** Final production locking

#### XO Detection

##### XO Detection Enable
- **Checked:** Enable crystal oscillator detection
- **Debounce Time:** Select filtering time (1/2/4/8 ms)
- **Use:** Ensure crystal stability before boot

#### AON Watchdog Configuration

##### Disable
- **Checked:** Disable Always-On Watchdog Timer
- **Use:** When watchdog not needed

##### Window
- **1 sec / 10 sec:** Watchdog timeout window
- **Use:** Adjust for application needs

##### Reset Mode
- **PD0:** Power domain 0 reset
- **PD1:** Power domain 1 reset
- **None:** No reset on timeout
- **Use:** Select reset behavior

#### Hard Fault Option
- **Function:** Configure hard fault handling
- **Use:** System error behavior

#### Compress Point
- **NA / Even / Odd:** Elliptic curve point compression
- **Use:** Cryptographic optimization

#### BOD (Brown-Out Detection)

##### Enable
- **Checked:** Enable brown-out detection
- **Function:** Detect low voltage conditions

##### BOD 2
- **Checked:** Enable secondary BOD

##### Threshold
- **Range:** 0-7
- **Function:** BOD Voltage threshold level

##### Reset Mode
- **PD0 / PD1:** Power domain reset on brown-out
- **Use:** System protection

#### SPI Speed
- **Options:** 2M / 4M / 8M / 16M Hz
- **Function:** SPI speed when download firmware with SPI
- **Use:** Match flash chip specifications

#### Exception Handling
- **Flash Read:** 0-3
- **Function:** Configure flash read error handling
- **Use:** Error recovery behavior

#### PD0 Reset Option
- **Checked:** Enable PD0 reset option
- **Use:** Power domain control

#### Operations
- **Read from EFUSE:** Load current Word 7 values
- **Write to EFUSE:** Save configuration (PERMANENT)

### EFUSE Words 4, 5, 6 (Calibration Data)

These words store analog calibration values.

#### Word 4 (Temperature)
- **No 2M Rate:** Disable 2M rate mode
- **ADC 1.5V V0/V1:** Temperature calibration values (hex)

#### Word 5 (VBAT)
- **V0/V1:** Battery voltage calibration values (hex)

#### Word 6 (ADC CH0)
- **V0/V1:** ADC channel 0 calibration values (hex)

**Note:** These values are typically set during factory calibration. Modify only if you have new calibration data.

#### Operations
- **Read from EFUSE:** Load current calibration values
- **Write to EFUSE:** Save calibration data (PERMANENT)

### EFUSE Words 8-15 (Public Key)

Store 256-bit public key for secure boot and authentication.

#### Key Display
- **Private Key:** Shows first 3 lines (if loaded)
- **Public Key:** Shows first 3 lines (derived from private key or read from EFUSE)

#### Key Operations

##### Generate Key
1. Click **Generate Key**
2. New ECC key pair is created
3. Display updates with new keys
4. **Save keys** to files before proceeding

##### Load Key
1. Click **Load Key**
2. Browse for private key file
3. Private and public keys are loaded
4. Display updates

##### Save Key
1. Click **Save Key**
2. Choose location and filename
3. Private and public keys are saved as txt files

##### Write to EFUSE
1. **Ensure correct key is loaded**
2. Click **Write to EFUSE**
3. **Confirm** in warning dialog
4. Public key is written to EFUSE words 8-15 (PERMANENT)
5. **Save private key securely** - you'll need it for signing

##### Read from EFUSE
1. Click **Read from EFUSE**
2. Public key is retrieved from chip
3. Display updates with read key
4. **Compare with expected key**

**Security Notes:**
- Keep private key secure and backed up
- Losing private key means you cannot sign firmware
- Public key in EFUSE cannot be changed once written
- Verify key before writing to EFUSE

---

## Image Setting Tab

*Available in Expert Mode only*

The Image Setting tab allows you to create custom firmware images with modified configurations, OTA headers, and device-specific settings.

### Firmware File Selection

1. Click **Browse** in the Application section
2. Select your base firmware binary (.bin)
3. Firmware information will be displayed automatically

### Boot Option Configuration

#### Default Config
- **Checked:** Use firmware's existing boot configuration
- **Unchecked:** Apply custom boot settings below

#### Boot Option
- **Normal Boot:** Standard boot sequence
- **Wait Boot:** Wait for the specified time before booting
- **GPIO Boot:** Boot controlled by GPIO pin state

#### Boot Pin Configuration
*Only for GPIO Boot mode:*
- **Port:** GPIO port (0-3)
- **Pin:** GPIO pin number (0-8)
- **Level:** Boot mode trigger level (Low/High)

**Example:** Port 0, Pin 3, Level Low = Enter boot mode when GPIO_0_3 is low, 

### OTA (Over-The-Air) Configuration

#### OTA Modes

##### Default Config
- Use firmware's existing OTA configuration
- No modifications to OTA header

##### Add OTA Header
- Add or modify OTA header to firmware
- Required for OTA update capability
- Configure SW and HW versions

##### Remove OTA Header
- Strip OTA header from firmware
- For non-OTA deployments

#### Version Configuration
*When adding OTA header:*

1. **SW Version:** Software version (e.g., `0.1.5.4` or `0x00010504`)
2. **HW Version:** Hardware version (e.g., `0.1.2.3` or `0x00010203`)

#### Key Management
*For OTA signature:*

1. **Generate Key:** Create new signing key pair
2. **Load Key:** Browse for existing private key 
3. **File Path:** Shows loaded key location

### Device Configuration

#### XO Cap (Crystal Oscillator Capacitance)

1. **Default Config:** Use chip default value
2. **Cap Value:** Custom capacitance value (when unchecked)
   - Typical range: 0-15
   - Adjust for crystal frequency accuracy

#### BD Address (Bluetooth Device Address)

1. **Default Config:** Use chip default or random address
2. **Address Fields:** MSB to LSB (when unchecked)
   - 6 bytes (12 hex digits)
   - Format: `XX:XX:XX:XX:XX:XX`
   - Example: `00:1B:DC:06:12:34`

3. **Generate User Data Bin:** Create user data binary with BD address and XO cap

### HCI FW Configuration

*For HCI (Host Controller Interface) firmware:*

#### HCI UART

1. **Default Config:** Use firmware defaults
2. **UART ID:** Select UART (0 or 1)
3. **TX Configuration:**
   - Port: GPIO port (0-3)
   - Pin: GPIO pin (0-8)
4. **RX Configuration:**
   - Port: GPIO port (0-3)
   - Pin: GPIO pin (0-8)

**Example:** UART 0, TX=GPIO_0_4, RX=GPIO_0_5

#### PA (Power Amplifier)

1. **Default Config:** Use firmware defaults
2. **TX EN (Transmit Enable):**
   - Port and Pin for TX enable signal
3. **RX EN (Receive Enable):**
   - Port and Pin for RX enable signal
4. **Bias:**
   - Port and Pin for PA bias control

#### TX Power

1. **Default Config:** Use firmware default power
2. **Power Level:** Transmit power in dBm
   - Typical range: 0 to 0x78
   - Higher values = greater range, more power consumption

### Generate Modified Firmware

After configuring all desired settings:

1. **Review all configurations**
2. Click **Generate Bin**
3. **Choose output location** and filename
4. Modified firmware file is created
5. **Use in Download tab** for programming

**Generated Firmware Includes:**
- Modified boot configuration (if selected)
- OTA header (if selected)
- HCI configuration (if applicable)

**Workflow Example:**
```
1. Load base firmware: app_v1.0.0.bin
2. Add OTA header: SW=1.0.0, HW=1.0
3. Set BD address: 00:1B:DC:AA:BB:CC
4. Generate: user_data.bin
5. Set TX power: 0 dBm
6. Generate: app_v1.0.0_custom.bin
7. Download custom firmware to chip
8. Download user_data.bin to chip
```

---

## Common Workflows

### Workflow 1: Basic Firmware Download (Normal Mode)

**Goal:** Program firmware to a new chip

1. **Launch** InPlay Programmer (Normal Mode)
2. **Connect Interface:**
   - Select UART interface
   - Choose COM port
   - Set baud rate to 115200
   - Click **Connect**
3. **Wait** for connection (status shows chip type)
4. **Navigate** to Download tab
5. **Load Firmware:**
   - Click Browse in Application section
   - Select firmware .bin file
6. **Verify** firmware information matches chip
7. **Configure:**
   - Address: `0x300000` (default)
   - Leave security options unchecked (for first time)
8. **Download:**
   - Click **Download** button
   - Monitor progress bar
   - Wait for completion message
9. **Disconnect** from chip
10. **Power cycle** chip to run new firmware

---

### Workflow 2: Firmware Download with Flash Secure (Expert Mode)

**Goal:** Develop and test firmware with flash security features

#### Phase 1: EFUSE Setup (Skip if the EFUSE has already been programmed)

1. **Switch to Expert Mode**
2. **Navigate** to Efuse Setting tab
3. **Connect** to chip via UART/JLink (recommended for EFUSE operations)
4. **Configure Security (Word 7):**
   - Enable **Flash Encrypt** 
   - Click **Write to EFUSE**
   - Click **Read from EFUSE** to check the result 
5. **Disconnect** from chip
6. **Reset** chip

#### Phase 2: Secure Download

1. **Navigate** to Download tab
2. **Connect** via UART
3. **Configure Download:**
   - Select firmware
   - Enable **Flash Secure**
   - Address: `0x300000`
4. **Download:**
   - Click **Download**
   - Monitor progress
   - Verify completion
5. **Disconnect**

---


### Workflow 3: Firmware Download with RAM Secure (Expert Mode)

**Goal:** Develop and test firmware with flash security features

#### Phase 1: EFUSE Setup (Skip if the EFUSE has already been programmed)

1. **Switch to Expert Mode**
2. **Navigate** to Efuse Setting tab
3. **Connect** to chip via UART/JLink (recommended for EFUSE operations)
4. **Configure Security (Word 7):**
   - Enable **RAM Secure** 
   - Click **Write to EFUSE**
   - Click **Read from EFUSE** to check the result 
5. **Disconnect** from chip
6. **Reset** chip

#### Phase 2: Secure Download

1. **Navigate** to Download tab
2. **Connect** via UART
3. **Configure Download:**
   - Select firmware
   - Enable **RAM Secure**
   - Address: `0x300000`
4. **Download:**
   - Click **Download**
   - Monitor progress
   - Verify completion
5. **Disconnect**

---


### Workflow 4: Firmware Download with Secure Boot (Expert Mode)

**Goal:** Develop and test firmware with security features

#### Phase 1: Key Generation and EFUSE Setup (Skip if the EFUSE has already been programmed)

1. **Switch to Expert Mode**
2. **Navigate** to Efuse Setting tab
3. **Generate Keys:**
   - Scroll to EFUSE Words 8-15 section
   - Click **Generate Key**
   - Click **Save Key** and choose secure location
   - **BACKUP** private key to safe location
4. **Connect** to chip via UART/JLink (recommended for EFUSE operations)
5. **Write Public Key:**
   - Click **Write to EFUSE** in Words 8-15 section
   - Click **Read from EFUSE** to check the result 
   - Verify success message
6. **Configure Security (Word 7):**
   - Enable **Secure Boot** 
   - Click **Write to EFUSE**
   - Click **Read from EFUSE** to check the result 
7. **Disconnect** from chip
8. **Reset** chip

#### Phase 2: Firmware Signing

1. **Navigate** to Secure tab
2. **Load Key** (saved in Phase 1)
3. **Configure Signature:**
   - Select firmware image file
   - Hash Start Address: `0x304000`(depend on your firmware)
   - Hash Total Size: (auto set)
4. **Calculate Signature:**
   - Click **Calculate Signature**
   - Wait for calculation
5. **Save Signature** to file
6. **Add signature** to firmware (Set it in in_config tool and rebuild firmware)

#### Phase 3: Download

1. **Navigate** to Download tab
2. **Connect** via UART
3. **Configure Download:**
   - Select signed firmware
   - Enable **Verify**
   - Address: `0x300000`
4. **Download:**
   - Click **Download**
   - Monitor progress
   - Verify completion
5. **Disconnect**

---

### Workflow 5: Authentication (Expert Mode)

**Goal:** Develop and test firmware with security features

#### Phase 1: Key Generation and EFUSE Setup (Skip if the EFUSE has already been programmed)

1. **Switch to Expert Mode**
2. **Navigate** to Efuse Setting tab
3. **Generate Keys:**
   - Scroll to EFUSE Words 8-15 section
   - Click **Generate Key**
   - Click **Save Key** and choose secure location
   - **BACKUP** private key to safe location
4. **Connect** to chip via UART/JLink (recommended for EFUSE operations)
5. **Write Public Key:**
   - Click **Write to EFUSE** in Words 8-15 section
   - Click **Read from EFUSE** to check the result 
   - Verify success message
6. **Configure Security (Word 7):**
   - Enable **Auth** 
   - Click **Write to EFUSE**
   - Click **Read from EFUSE** to check the result 
7. **Disconnect** from chip
8. **Reset** chip

#### Phase 2: Authentication

1. **Navigate** to Secure tab
2. **Load Key** (saved in Phase 1)
3. **Connect** via UART, and perform authentication automatically
4. **Manual Authentication**(Optional)
   - **Navigate** to Secure tab
   - Click **Auth** button
   - Verify success message
5. **Disconnect**

---

### Workflow 6: OTA Firmware Update Preparation

**Goal:** Create firmware for Over-The-Air updates

#### Create OTA Firmware

1. **Switch to Expert Mode**
2. **Navigate** to Image Setting tab
3. **Load Base Firmware:**
   - Click Browse
   - Select your application firmware
4. **Configure OTA:**
   - Select "Add OTA Header" radio button
   - Enter SW Version (e.g., `0.1.5.0`)
   - Enter HW Version (e.g., `0.22.0.1`)
5. **Sign Firmware (if secure boot enabled):**
   - Click **Load Key** to load OTA signing key
   - Or **Generate Key** if first time
   - Key path will display
6. **Generate:**
   - Click **Generate Bin**
   - Save as `app_v1.5.0_ota.bin`
7. **Verify:**
   - Load generated file in Download tab
   - Check firmware info shows OTA header present
   - Verify versions are correct

#### Program OTA Firmware

1. **Navigate** to Download tab
2. **Load** generated OTA firmware
3. **Configure:**
   - Address:  (e.g., `0x304000`)
   - Verify address is correct 
4. **Download:**
   - Connect to chip
   - Click Download
   - Verify completion
---

## Troubleshooting

### General Troubleshooting

1. **Restart Application:**
   - Close InPlay Programmer
   - Disconnect all hardware
   - Reconnect and restart

2. **Check Logs:**
   - Look in `logs/` directory
   - Find recent log files
   - Search for error messages
   - Share with support if needed

3. **Try Different Computer:**
   - Rules out PC-specific issues
   - Different USB stack may help

4. **Test with Known-Good Hardware:**
   - Use a chip that worked before
   - Use a different serial adapter or JLink probe
   - Swap cables


### Common Issues and Solutions

#### Issue: UART "Connection Failed" or "Connection Timeout"

**Possible Causes:**
- Incorrect COM port selected
- Chip not powered
- RX/TX wires swapped
- Chip not in bootloader mode
- Baud rate mismatch
  
**Solutions:**
1. Verify chip has power (measure voltage)
2. Check COM port in Device Manager (Windows) or `ls /dev/tty*` (Linux/macOS)
3. Swap RX/TX wires
4. Reset chip and retry immediately
5. Reduce baud rate to 115200
6. Check if another program is using the port
7. Update USB-to-serial drivers
8. Verify chip is in bootloader mode (not running application), connect boot pin to ground or VCC(depend on boot configuration)
---

#### Issue: JLINK "Connection Failed" or "Connection Timeout"

**Possible Causes:**
- Incorrect JLink port selected
- Chip not powered
- SWD/JTAG wires swapped
- Chip not in bootloader mode
  
**Solutions:**
1. Verify chip has power (measure voltage)
2. Check USB connection to PC
3. Verify JLink LED status
4. Check SWD/JTAG cable connections
5. Verify power to target chip
6. Check GND connection
7. Install latest JLink drivers from SEGGER
8. Reduce speed (e.g., 1000 kHz)
9. Verify chip is in bootloader mode (not running application), connect boot pin to ground or VCC(depend on boot configuration)
---

#### Issue: "Chip Type Mismatch" Warning

**Possible Causes:**
- Wrong firmware file for your chip
- Firmware compiled for different chip variant

**Solutions:**
1. Verify chip type (should show in connection status)
2. Check firmware information panel for chip type
3. Obtain correct firmware for your chip (IN602A2/C0/F1)
4. Contact firmware developer if unsure

---

#### Issue: Download Fails or Stalls

**Possible Causes:**
- Unstable connection
- Baud rate too high
- Insufficient power
- Flash memory issues


**Solutions:**
1. Reduce baud rate to 115200
2. Check power supply (stable 3.3V/1.8V required)
3. Try JLink mode instead of UART
4. Verify address and size are correct

---

#### Issue: Verification Failed

**Possible Causes:**
- Download was corrupted
- Flash memory defective
- Power fluctuation during download
- Encrypted firmware mismatch

**Solutions:**
1. Retry download with verification disabled
2. Reduce baud rate for more reliable download
3. Check power supply stability
4. Try JLink mode (no verification needed)
5. If persistent, chip flash may be damaged

---

#### Issue: "Authentication Failed"

**Possible Causes:**
- Wrong private key loaded
- Public key in EFUSE doesn't match private key
- Host authentication not enabled in EFUSE
- Connection issue

**Solutions:**
1. Verify you loaded the correct private key
2. Read public key from EFUSE and compare
3. Check EFUSE Word 7 for Host Authentication bit
4. Reconnect to chip and retry
5. If keys don't match, you may need to use chip recovery procedures

---

#### Issue: Cannot Write to EFUSE

**Possible Causes:**
- EFUSE already written (bits cannot go from 1→0)
- Customer lock enabled
- Vendor lock enabled
- Connection issue
- Insufficient power
- VDDQ is not connect to VCC(3.3V)

**Solutions:**
1. Read EFUSE first to check current values
2. Verify bits you're trying to write are currently 0
3. Check if lock bits are set (Customer Lock, Vendor Lock)
4. Ensure stable connection
5. Verify adequate power supply
6. If locked, EFUSE cannot be changed (by design)
7. Connect VDDQ to VCC(3.3V)
---

#### Issue: JLink Not Detected

**Possible Causes:**
- JLink not connected
- USB cable issue
- JLink drivers not installed
- JLink in use by another program

**Solutions:**
1. Check USB cable connection
2. Try different USB port
3. Install/update JLink drivers from SEGGER website
4. Close other programs using JLink (e.g., Ozone, J-Flash)
5. Click "Refresh Probes" button
6. Restart computer if persistent

---

#### Issue: Firmware Won't Run After Download

**Possible Causes:**
- Wrong start address
- Firmware compiled for different address
- Secure boot enabled but firmware not signed
- Flash encryption enabled but firmware not encrypted
- Boot configuration incorrect

**Solutions:**
1. Verify download address matches firmware link address
2. Check firmware information panel for expected address
3. If secure boot enabled, verify firmware is properly signed
4. If flash encryption enabled, ensure secure download used
5. Check boot configuration in EFUSE Word 0/7
6. Try downloading to default address (0x300000)
7. Power cycle chip after download

---

### Getting Help

If you continue to experience issues:

1. **Check Logs:**
   - Location: `logs/` directory in application folder
   - Find most recent log file
   - Look for ERROR or WARNING messages

2. **Gather Information:**
   - Application version (shown in title bar)
   - Chip type (IN602A2/C0/F1)
   - Interface type (UART/JLink)
   - Exact error message
   - Steps to reproduce

3. **Contact Support:**
   - Include log files
   - Include firmware information if relevant
   - Describe hardware setup
   - Explain what you were trying to do

---

## Appendix A: Keyboard Shortcuts

*(Note: Verify if implemented in your version)*

- **Ctrl+O**: Browse for file (when applicable)
- **Ctrl+R**: Refresh connection
- **Ctrl+D**: Download (when ready)
- **Ctrl+E**: Erase flash
- **ESC**: Cancel operation

---

## Appendix B: File Formats

### Firmware Binary (.bin)
- Raw binary firmware image
- No special format required
- Can include OTA header (optional)
- Typical size: 64KB - 512KB

---

## Appendix C: Memory Map

### Typical IN602 Memory Layout

```
0x00000000 - 0x00060000: ROM (Read-only)
0x00200000 - 0x00220000: RAM
0x00300000 - 0x00380000: Flash (Application)
```

**Note:** Exact layout varies by chip variant. Consult chip datasheet.

---

