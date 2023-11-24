# HCI Command

## Introduction to BLE HCI Commands

Bluetooth Low Energy (BLE) is a wireless communication technology designed for short-range communication with low power consumption. In BLE-enabled systems, the Host Controller Interface (HCI) serves as a crucial bridge between the host (application processor) and the Bluetooth controller embedded in the device. HCI commands play a pivotal role in facilitating communication and control between these two components.

## Purpose of BLE HCI Commands

BLE HCI commands are standardized instructions exchanged between the host and the Bluetooth controller to manage and configure Bluetooth communication. These commands enable the host to initiate various actions, such as establishing connections, configuring parameters, and managing the overall behavior of the Bluetooth device.

## HCI Command Structure

BLE HCI commands follow a specific structure, adhering to a standardized format that includes an HCI type, opcode, and parameters. Understanding this structure is essential for developers and engineers working on BLE-enabled devices, as it allows them to communicate effectively with the Bluetooth controller.

## HCI Command Format

The general format of a BLE HCI command packet is as follows:

```markdown
| HCI Type (1 byte) | Opcode (2 bytes) | Param Length | Params |
|-------------------|------------------|--------------|--------|
```

- **HCI Type:** A one-byte identifier specifying the type of HCI command. It is 0x1 for HCI command packet.
- **Opcode (Operation Code):** A unique identifier (2 bytes) specifying the type of command.
- **Parameter Length:** A byte indicating the length of the parameters that follow.
- **Parameters:** Additional data or information associated with the command.

## HCI Event Format

Similarly, the format for an HCI event packet is structured as follows:

```markdown
| HCI Type (1 byte) | Event Code (1 byte) | Parameter Length | Data | 
|-------------------|---------------------|------------------|------|
```

- **HCI Type:** A one-byte identifier specifying the type of HCI event. It is 0x4 for HCI event packet.
- **Event Code:** A unique identifier (1 byte) specifying the type of event or response. It is 0xE for command complete event. 
- **Parameter Length:** A byte indicating the length of the parameters or data that follow.
- **Data:** Additional information or payload associated with the event or response.

## Command Example:

**Reset Command**

Command: `0x01, 0x03, 0x0C, 0x00`

- 0x01 – HCI Type
- 0x03 0x0C – operation code
- 0x00 – the number of bytes of parameters. For reset, the number is zero because no parameter.

Command Complete Event: `0x04, 0x0E, <Commands Available>, 0x01, 0x03, 0x0C, <status>`

- `0x04` – single byte before all events.
- `0x0E` – event code after command completion
- `<Commands Available>` – the number of commands that the controller can receive. It is 0x1 by default.
- `0x01 0x03 0x0C` – operation code
- `<status>` – `0x00` means the command was successful. If not `0x00`, it means an error. The error list reference is to *Volume 2 Part D of the Core Spec for a list of error codes*.

## Command Parameters

- packet type:
  
  | Packet type | Payload                                                        |
  | ----------- | -------------------------------------------------------------- |
  | 0x00        | PRBS9 sequence ‘11111111100000111101…’ (in transmission order) |
  | 0x01        | Repeated ‘11110000’ (in transmission order)                    |
  | 0x02        | Repeated ‘10101010’ (in transmission order)                    |
  | 0x03        | PRBS15                                                         |
  | 0x04        | Repeated ‘11111111’                                            |
  | 0x05        | Repeated ‘00000000’                                            |
  | 0x06        | Repeated ‘00001111’                                            |
  | 0x07        | Repeated ‘01010101’                                            |

*Table 1*

- phy:
  
  | Phy  | Description                                                  |
  | ---- | ------------------------------------------------------------ |
  | 0x01 | Transmitter set to use the LE 1M PHY                         |
  | 0x02 | Transmitter set to use the LE 2M PHY                         |
  | 0x03 | Transmitter set to use the LE Coded PHY with S=8 data coding |
  | 0x04 | Transmitter set to use the LE Coded PHY with S=2 data coding |

*Table 2*

- tx power:
  
  | Value | TX Power  |
  | ----- | --------- |
  | 0x00  | Max Power |
  | 0x01  | 7dBm      |
  | 0x02  | 6.5dBm    |
  | 0x03  | 6dBm      |
  | 0x04  | 5.5dBm    |
  | 0x05  | 5dBm      |
  | 0x06  | 4.5dBm    |
  | 0x07  | 4dBm      |
  | 0x08  | 3.5dBm    |
  | 0x09  | 3dBm      |
  | 0x0A  | 2.5dBm    |
  | 0x0B  | 2dBm      |
  | 0x0C  | 1.5dBm    |
  | 0x0D  | 1dBm      |
  | 0x0E  | 0.5dBm    |
  | 0x0F  | 0dBm      |
  | 0x10  | -1dBm     |
  | 0x11  | -2dBm     |
  | 0x12  | -3dBm     |
  | 0x13  | -4dBm     |
  | 0x14  | -5dBm     |
  | 0x15  | -6dBm     |
  | 0x16  | -8dBm     |
  | 0x17  | -12dBm    |
  | 0x18  | -16dBm    |
  | 0x19  | -20dBm    |
  | 0x1A  | -43dBm    |

*Table 3*

## HCI  Test Command Description

1. ### Reset

The Reset command needs to be sent only once after power-up.

Command: 0x01, 0x03, 0x0C, 0x00

Complete Event: 0x04, 0x0E,01, 0x01, 0x03, 0x0C, \<status>

2. ### End Test

After each modulation signal test command (TX or RX command) is completed, you need to send an "end test command." The end test command is as simple as the reset command, but the return command is more complex. The commands returned by the serial port include 2 bytes, indicating the number of packets received by DUT at the end of the command. Reference to *Volume 2 Part E Section 7.8.30.*

Command: 0x01, 0x1F, 0x20, 0x00

Complete Event：0x04, 0x0E, 01, 0x01, 0x1F, 0x20, \<status>, \<packets number byte 0>, \<packets number byte 1>

3. ### Start TX Test (Modulation signal)

The LE TX test command has 3 parameters, channel ,data length ,packet type. Reference to *Volume 2 Part E Section 7.8.29*.

Transmitter Test command：0x01, 0x1E, 0x20, 0x03, \<channel>, \<data length>, \<packet type>

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402G
- data length: please use 0x25 in 1M mode
- packet type: please refer to table 1.

Complete Event：0x04, 0x0E, 01, 0x01, 0x1E, 0x20, \<status>

4. ### Start RX Test (Receive mode)

The LE RX test command has 1 parameter, channel. Reference to *Volume 2 Part E Section 7.8.28*.

Receive Test command：0x01, 0x1D, 0x20, 0x01, \<channel>

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402GHz

Complete Event 0x04, 0x0E, 0x01, 0x01, 0x1D, 0x20, \<status>

5. ### Start Carrier TX (carrier signal)

Command：0x01, 0x01, 0xFC, 0x02, \<channel> \<TX gain>

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402GHz
- TX gain:  
  - 0: use default value.  
  - 0x1 ~ 0x7F: PA gain, 0x19 is 0dBm. 

Complete Event：0x04, 0x0E, 0x01, 0x01, 0x01, 0xFC, \<status>

6. ### Start Enhanced TX Test

The LE Enhanced TX Test command has 3 parameters - the transmit channel.  See Volume 2 Part E Section 7.8.501  

Command: 0x01, 0x34, 0x20, 0x04, \<channel>, \<data length>, \<packet type>, \<phy>

- channel: the range is 0x00 to 0x27 (39), the formula is: N = (F - 2402)/ 2; 0x00 represents 2.402G

- data length: please use 0x25 in 1M mode

- packet type: please refer to table 1

- phy: Please refer to table 2

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x34, 0x20, \<status>

7. ### Start Enhanced RX Test

The LE Enhanced Receive Mode Test command has one parameter - Receive Channel, see Volume 2 Part E Section 7.8.50.  

Command: 0x01, 0x33, 0x20, 0x03, \<channel>, \<phy>, \<modulation index> 

- channel: range 0x00 to 0x27 (39), formula: N = (F - 2402)/ 2; 0x00 represents 2.402G

- phy: please refer to table 1

- modulation index: Normally set to 0
  
  - 0x00 Assume transmitter will have a standard modulation index
  
  - 0x01 Assume transmitter will have a stable modulation index

Complete Event: 0x04, 0x0E, 01, 0x01, 0x33, 0x20, \<status>

8. ### Stop Carrier TX ( Carrier signal)

Command：0x01, 0x04, 0xFC, 0x00

Complete Event:0x04, 0x0E,0x01, 0x01, 0x04, 0xFC, \<status>

9. ### Get RSSI

Command：0x01, 0x03, 0xFC, 0x00

Complete Event: 0x04, 0x0E, 01, 0x01, 0x03, 0xFC, \<status> ，\<RSSI>

- RSSI: value of RSSI, it is a  int8\_t value. Example: return value is 0xCD, RSSI=0xCD-0x100=-51dBm
10. ### Vendor TX command

Command：0x01, 0x0D, 0xFC, 0x06, \<channel>, \<data length>, \<packet type>, \<phy>, \<midx>, \<continue tx>

- channel: See  “Start Enhanced TX Test”

- data length: See  “Start Enhanced TX Test”

- packet type: Refer to table 1

- phy: Refer to table 2

- midx: Reserved, must set to 0.

- cont tx: 
  
  - 1: Continuous TX
  
  - 0: Normal TX

Complete Event:0x04, 0x0E, 0x01, 0x01, 0x0D, 0xFC, \<status>

11. ### Set Cap

Command: 0x01, 0x05, 0xFC, 0x01 \<Cap>

- cap:  capacitance  range is 0x0~0xF

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x05, 0xFC, \<status>

12. ### Save Cap to Efuse

Command: 0x01, 0x06, 0xFC, 0x01 \<Cap>

- cap:  capacitance  range is 0x0~0xF

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x06, 0xFC, \<status>

**Notice:**

This command burn cap data to Efuse memory. Must supply 3.3V power on VDDQ pin.

Efuse is OTP(One Time Programmable) memory. Make sure bure correct value in Efuse.

13. ### Save  Cap to Flash

Command: 0x01, 0x08, 0xFC, 0x01, \<Cap>

- cap:  capacitance  range is 0x0~0xF
  
  Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x08, 0xFC, \<status>
14. ### Set TX Power
    
    Sets the transmit power. Note that it is not valid for Carrier TX command.

Commands: 0x01, 0x07, 0xFC, 0x01, \<TX Power>

- TX Power: transmit power, range 0x00~0x7F. Default is 0x18.

Complete Event: 0x04, 0x0E, 01, 0x01, 0x07, 0xFC, \<status> 

15. ### Read Register
    
    Read register.

Command: 0x01, 0x0E, 0xFC, 0x04, \<Address Byte0>,\<Address Byte1>,\<Address Byte2>，\<Address Byte3>

- Address Byte0: Register address byte 0.

- Address Byte1: Register address byte 1

- Address Byte2: Register address byte 2

- Address Byte3: Register address byte 3

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x07, 0xFC, \<status> ,\<Reg Value Byte 0>, \<Reg Value Byte 1>,\<Reg Value Byte 2>，\<Reg Value Byte 3>

- Reg Value Byte 0: Register value byte 0
- Reg Value Byte 1: Register value byte 1
- Reg Value Byte 2: Register value byte 2
- Reg Value Byte 3: Register value byte 3
16. ### Write Register

Write register.

Command: 0x01, 0x0F, 0xFC, 0x08, \<Address Byte0>,\<Address Byte1>,\<Address Byte2>，\<Address Byte3>, \<Reg Value Byte 0>, \<Reg Value Byte 1>,\<Reg Value Byte 2>，\<Reg Value Byte 3>

- Address Byte0: Register address byte 0.

- Address Byte1: Register address byte 1

- Address Byte2: Register address byte 2

- Address Byte3: Register address byte 3

- Reg Value Byte 0: Register value byte 0.

- Reg Value Byte 1: Register value byte 1.

- Reg Value Byte 2: Register value byte 2.

- Reg Value Byte 3: Register value byte 3.

Complete Event:  0x04, 0x0E, 0x01, 0x01, 0x07, 0xFC, \<status> 

17. ### Start PWM
    
    Command: 0x01, 0x09, 0xFC, 0x01, \<pwm id>

- pwm id:

    - PWM0    0

    - PWM1     1

    - PWM2    2

    - PWM3    3

    - PWM4   4

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x09, 0xFC, \<status> 

18. ### Stop PWM
    
    Command: 0x01, 0x0A, 0xFC, 0x00

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x0A, 0xFC, \<status> 

19. ### Get Version Number
    
    Command: 0x01, 0x50, 0xFC, 0x00

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x50, 0xFC, \<status> , \<version byte 0>, \<version byte 1>, \<version byte 2>, \<version byte 3>

- version: 32bit HCI command SW version number
20. ### Set TX Gain
    
    Command: 0x01, 0x51, 0xFC, 0x00, \<TX Gain>
    
    - TX Gain: TX gain, range is0x00 ~ 0x7F.  Default is 0x18.

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x51, 0xFC, \<status> 

***The following command in only available for Golden tester board.***

21. ### DUT Calibrate XO
    
    Command 0x01, 0x31, 0xFC, 0x03, \<pwm id>, \<save>, \<limit>

Calibrate XO with PWM signal.

- pwm id:

  - PWM0    0

  - PWM1     1

  - PWM2    2

  - PWM3    3

  - PWM4    4

- save: 

  - 0: don’t save cap value.

  - 1: save cap value on flash.

- limit: Max offset between DUT and tester. Unit is 1/8 us at 100ms(1.25PPM).

For example, limit is 16, means that offset is  ±2us at every 100ms(20 PPM).

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x31, 0xFC, \<status>,\<cap>,\<offset> 

- cap: cap value

- offset: Offset between DUT and tester , Unit is 1/8 us at 100ms(1.25PPM).
22. ### DUT Set TX Power
    
    Test DUT tx power command: 0x01, 0x32, 0xFC, 0x03 \<ch>, \<phy>, \<tx powe code>
- ch: 0 ~ 39
- phy: Please refer to table 2
- tx power: DUT tx power code(0x0 ~ 0x7F), only available for carrier.

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x32, 0xFC, \<status>,\<rssi> 

- rssi: RSSI value
23. ### DUT RX Sensitivity
    
    Test DUT RX sensitivity command: 0x01, 0x33, 0xFC, 0x03, \<ch>, \<phy>, \<loss rate>
- ch: 0 ~ 39

- phy: Please refer to table 2

- loss rate:  0~255, unit is 0.1%.  For example ,20 means 2%

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x33, 0xFC, \<status>,\<tx power> \<loss rate> 

- tx power: Tester TX power

- loss rate: loss rate, unit is 0.1%.  20 means 2%.
24. ### DUT Download Image
    
    Command: 0x01, 0x34, 0xFC, 0x08,\<bootram size byte 0>,\<bootram size byte 1>,\<bootram size byte 2>,\<bootram size byte 3>,\<image size byte 0>,,\<image size byte 1>,\<image size byte 2>,\<image size byte 3>
    
    - bootram size: bootram size. Default is 0x2000.
    - image size: application image size.

Example: bootram size is 0x2000 bytes, image size is 0xAC00 bytes:

01 34 fc 08 00 20 00 00 00 ac 00 00

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x34, 0xFC, \<status>

25. ### Start BLE Scan
    
    Command: 0x01, 0x40, 0xFC, 0x07,\<channel>,\<BD addr byte 0>,\< BD addr byte 1>,\< BD addr byte 2>,\< BD addr byte 3 >,\< BD addr byte 4>,\< BD addr byte 5 >
- channel: Scan channel. 37, 38 or 39

- BD addr: BLE device address, 6 bytes

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x40, 0xFC, \<status>

26. ### Start SDR Scan
    
    Command: 0x01, 0x41, 0xFC, 0x05,\<channel>,\<access addr byte 0>,\<access addr byte 1>,\<access addr byte 2>,\<access addr byte 3 >
- channel:Scan channel. Range is 0 ~  39.

- addcess addr: SDR access address, 4 bytes

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x41, 0xFC, \<status>

27. ### Stop Scan
    
    Command: 0x01, 0x42, 0xFC, 0x00

Complete Event: 0x04, 0x0E, 0x01, 0x01, 0x41, 0xFC, \<status>, \<RSSI>,\<freq\_offset\_code byte 0 >,\< freq\_offset\_code byte 1 >,\<receive packet number byte 0>,\<receive packet number byte 1>

- RSSI: value of RSSI, int8\_t. Example: return value is 0xCD, RSSI=0xCD-0x100=-51dBm

- freq\_offset\_code: frequency offset code. It is int16\_t value. Use this to covert to KHz:

Offset(KHz) = 500.0/1024\* freq\_offset\_code 
