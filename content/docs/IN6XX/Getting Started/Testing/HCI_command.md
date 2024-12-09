---
title: "HCI Command"
---

# HCI Command

## Introduction to BLE HCI Commands

BLE HCI commands are standardized instructions exchanged between the host and the Bluetooth controller to manage and configure Bluetooth communication. These commands enable the host to initiate various actions, such as establishing connections, configuring parameters, and managing the overall behavior of the Bluetooth device.

## HCI Command Structure

BLE HCI commands follow a specific structure, adhering to a standardized format that includes an HCI type, opcode, and parameters. Understanding this structure is essential for developers and engineers working on BLE devices, as it allows them to communicate effectively with the Bluetooth controller.

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

Command Complete Event: `0x04, 0x0E, <Packet len ><Commands Available>, 0x01, 0x03, 0x0C, <status>`

- `0x04` – single byte before all events.
- `0x0E` – event code after command completion
- `<Packet Len>` - Length of all of the parameters contained in this packet. It is 0x4 in this example.
- `<Commands Available>` – the number of commands that the controller can receive. It is 0x1 by default.
- `0x01 0x03 0x0C` – operation code
- `<status>` – `0x00` means the command was successful. If not `0x00`, it means an error. The error list reference is to *Volume 2 Part D of the Core Spec for a list of error codes*.

## Command Parameters
*Table 1*
- packet type:
  
  | Packet type |Payload                                                        |
  | ----------- | -------------------------------------------------------------- |
  | 0x00        | PRBS9 sequence ‘11111111100000111101…’ (in transmission order) |
  | 0x01        | Repeated ‘11110000’ (in transmission order)                    |
  | 0x02        | Repeated ‘10101010’ (in transmission order)                    |
  | 0x03        | PRBS15                                                         |
  | 0x04        | Repeated ‘11111111’                                            |
  | 0x05        | Repeated ‘00000000’                                            |
  | 0x06        | Repeated ‘00001111’                                            |
  | 0x07        | Repeated ‘01010101’                                            |



----
*Table 2*
- phy:
  
  | Phy  | Description                                                  |
  | ---- | ------------------------------------------------------------ |
  | 0x01 | Transmitter set to use the LE 1M PHY                         |
  | 0x02 | Transmitter set to use the LE 2M PHY                         |
  | 0x03 | Transmitter set to use the LE Coded PHY with S=8 data coding |
  | 0x04 | Transmitter set to use the LE Coded PHY with S=2 data coding |



----

## HCI  Test Command Description

1. ### Reset

The Reset command needs to be sent only once after power-up.

Command: `0x01, 0x03, 0x0C, 0x00`

Complete Event: `0x04, 0x0E,0x04, 0x01, 0x03, 0x0C, <status>`

2. ### End Test

After each modulation signal test command (TX or RX command) is completed, you need to send an "end test command." The end test command is as simple as the reset command, but the return command is more complex. The commands returned by the serial port include 2 bytes, indicating the number of packets received by DUT at the end of the command. Reference to *Volume 2 Part E Section 7.8.30.*

Command: `0x01, 0x1F, 0x20, 0x00`

Complete Event：`0x04, 0x0E, 0x06, 0x01, 0x1F, 0x20, <status>, <packets number byte 0>, <packets number byte 1>`

3. ### Start TX Test (Modulation signal)

The LE TX test command has 3 parameters, channel ,data length ,packet type. Reference to *Volume 2 Part E Section 7.8.29*.

Transmitter Test command：`0x01, 0x1E, 0x20, 0x03, <channel>, <data length>, <packet type>`

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402G
- data length: please use 0x25 in 1M mode
- packet type: please refer to Table 1.

Complete Event：`0x04, 0x0E, 0x04, 0x01, 0x1E, 0x20, <status>`

4. ### Start RX Test (Receive mode)

The LE RX test command has 1 parameter, channel. Reference to *Volume 2 Part E Section 7.8.28*.

Receive Test command：`0x01, 0x1D, 0x20, 0x01, <channel>`

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402GHz

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x1D, 0x20, <status>`


5. ### Start Enhanced TX Test

The LE Enhanced TX Test command has 3 parameters - the transmit channel.  See Volume 2 Part E Section 7.8.501  

Command: `0x01, 0x34, 0x20, 0x04, <channel>, <data length>, <packet type>, <phy>`

- channel: the range is 0x00 to 0x27 (39), the formula is: N = (F - 2402)/ 2; 0x00 represents 2.402G

- data length: please use 0x25 in 1M mode

- packet type: please refer to Table 1

- phy: Please refer to Table 2

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x34, 0x20, <status>`

6. ### Start Enhanced RX Test

The LE Enhanced Receive Mode Test command has one parameter - Receive Channel, see Volume 2 Part E Section 7.8.50.  

Command: `0x01, 0x33, 0x20, 0x03, <channel>, <phy>, <modulation index>` 

- channel: range 0x00 to 0x27 (39), formula: N = (F - 2402)/ 2; 0x00 represents 2.402G

- phy: please refer to Table 2

- modulation index: Normally set to 0
  
  - 0x00 Assume transmitter will have a standard modulation index
  
  - 0x01 Assume transmitter will have a stable modulation index

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x33, 0x20, <status>`

***The following commands are vendor specified.***

7. ### Stop Carrier TX ( Carrier signal)

Command：`0x01, 0x04, 0xFC, 0x00`

Complete Event:`0x04, 0x0E,0x04, 0x01, 0x04, 0xFC, <status>`


8. ### Start Carrier TX (carrier signal)

Command：`0x01, 0x01, 0xFC, 0x02, <channel> <TX gain>`

- channel: the range is 0x00 to 0x27（39），Formula：N =（F – 2402）/ 2；  0x00 means 2.402GHz
- TX gain:  
  - 0: Don't change TX power setting.  
  - 0x1 ~ 0x7F: PA gain. 

Note:

	Suggest set TX gain to 0x0, and use "Set TX Power" command to set TX power.

Complete Event：`0x04, 0x0E, 0x04, 0x01, 0x01, 0xFC, <status>`

1. ### Get RSSI

Command：`0x01, 0x03, 0xFC, 0x00`

Complete Event: `0x04, 0x0E, 0x05, 0x01, 0x03, 0xFC, <status> ，<RSSI>`

- RSSI: value of RSSI, it is a  int8\_t value. Example: return value is 0xCD, RSSI=0xCD-0x100=-51dBm
10. ### Vendor TX command

Command：`0x01, 0x0D, 0xFC, 0x08, <channel>, <data length>, <packet type>, <phy>, <midx>, <continue tx>, <packet number byte 0>, <packet number byte 1>`

- channel: See  “Start Enhanced TX Test”

- data length: See  “Start Enhanced TX Test”

- packet type: Refer to Table 1

- phy: Refer to Table 2

- midx: Reserved, must set to 0.

- cont tx: 
  
  - 1: Continuous TX
  
  - 0: Normal TX
- packet number: TX packet number, 0 is TX forever.
Note:
	If packet number is not 0, current is a little higher.

Complete Event:`0x04, 0x0E, 0x04, 0x01, 0x0D, 0xFC, <status>`

21. ### Vendor TX end 
    Stop TX and send back TX packets,
    Command: `0x01, 0x53, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x06, 0x01, 0x53, 0xFC, <status> ,<packet number byte 0>, <packet number byte 1>`
	- packet number: TX packet number

22.   ### Set Cap

	Set XO cap

Command: `0x01, 0x05, 0xFC, 0x01 <Cap>`

- cap:  capacitance  range is 0x0~0xF. And 0xFF means use default value.

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x05, 0xFC, <status>`

22.   ### Save Cap
   
	Save XO cap value to flash

Command: `0x01, 0x08, 0xFC, 0x00 `

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x08, 0xFC, <status>`

1.  ### Set TX Power
    
    Set the transmit power according to Table 3. 

Commands: `0x01, 0x07, 0xFC, 0x01, <TX Power>`

- TX Power: transmit power, range is 0x00 ~ 0x7F.  Default is 0x18.

Complete Event: `0x04, 0x0E, 01, 0x04, 0x07, 0xFC, <status>`


1.   ### Read Register
    
    Read register.

Command: `0x01, 0x0E, 0xFC, 0x04, <Address Byte0>,<Address Byte1>,<Address Byte2>，<Address Byte3>`

- Address Byte0: Register address byte 0.

- Address Byte1: Register address byte 1.

- Address Byte2: Register address byte 2.

- Address Byte3: Register address byte 3.

Complete Event: `0x04, 0x0E, 0x08, 0x01, 0x07, 0xFC, <status> ,<Reg Value Byte 0>, <Reg Value Byte 1>,<Reg Value Byte 2>，<Reg Value Byte 3>`

- Reg Value Byte 0: Register value byte 0.
- Reg Value Byte 1: Register value byte 1.
- Reg Value Byte 2: Register value byte 2.
- Reg Value Byte 3: Register value byte 3.
17. ### Write Register

Write register.

Command: `0x01, 0x0F, 0xFC, 0x08, <Address Byte0>,<Address Byte1>,<Address Byte2>，<Address Byte3>, <Reg Value Byte 0>, <Reg Value Byte 1>,<Reg Value Byte 2>，<Reg Value Byte 3>`

- Address Byte0: Register address byte 0.

- Address Byte1: Register address byte 1.

- Address Byte2: Register address byte 2.

- Address Byte3: Register address byte 3.

- Reg Value Byte 0: Register value byte 0.

- Reg Value Byte 1: Register value byte 1.

- Reg Value Byte 2: Register value byte 2.

- Reg Value Byte 3: Register value byte 3.

Complete Event:  `0x04, 0x0E, 0x04, 0x01, 0x07, 0xFC, <status>`



20. ### Get Version Number
    
    Command: `0x01, 0x50, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x08, 0x01, 0x50, 0xFC, <status> , <version byte 0>, <version byte 1>, <version byte 2>, <version byte 3>`

    - Version: 32bit HCI command SW version number


20. ### Set TRX Enable Pin
    
    Command: `0x01, 0x44, 0xFC, 0x06,  <bias port> <bias pin>, <tx en port>, <tx en pin>,<rx en port>, <rx en pin>`
	- bias port: PA bias port, set to 0xFF if it is invaild
	- bias pin: PA bias pin, set to 0xFF if it is invaild	
	- tx en port: TX enable port
	- tx en pin: TX enable pin
	- rx en port: RX enable port
	- rx en pin: RX enable pin

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x44, 0xFC, <status> `

20. ### Save Configuration

	Save PA  and tx power configuration to flash.

    Command: `0x01, 0x57, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x57, 0xFC, <status> `
	
20. ### Use Default Configuration

	Use default PA and tx power configuration, clear the setting on flash.

    Command: `0x01, 0x58, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x58, 0xFC, <status> `


21. ### GPIO Output
    
    Command: `0x01, 0x0B, 0xFC, 0x03, <port>, <pin>, <output>`
	- port: GPIO port
	- pin: GPIO pin
	- output: GPIO output, 1 is high and 0 is low
  
	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x0B, 0xFC, <status> `

22. ### GPIO input
    
    Command: `0x01, 0x0C, 0xFC, 0x03, <port>, <pin>, <pull>`
	- port: GPIO port
	- pin: GPIO pin
	- pull: 0 is no pull up/down, 1 is pull up and 2 is pull down

  
	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x0C, 0xFC, <status> <GPIO input>`
	- GPIO input: 1 is high and 0 is low

22. ### Get ADC sample
    
    Command: `0x01, 0x43, 0xFC, 0x02, <ADC channel>, <parameter>`
	- ADC channel: ADC channel
	- parameter: If ADC channel is not 13, set this to 0x0. If ADC channel is 13, this value is register pmu_test_mux_ctrl[0:7].
	Complete Event: `0x04, 0x0E, 0x08, 0x01, 0x43, 0xFC, <status> , <Sample raw data byte 0>, <Sample raw data byte 1> <Sample converted data byte 0>, <Sample converted data byte 1>`

    - Sample raw data: 16 bits ADC sample raw data.
    - Sample converted data: 16 bits converted data in millivolt.
23. ### Start PWM
    Start PWM
    Command: `0x01, 0x09, 0xFC, 0x09, <pwm id>, <period byte 0>, <period byte 1>, <period byte 2>, <period byte 3>, <high byte 0>, <high byte 1>, <high byte 2>, <high byte 3>`

- pwm id:

    - PWM0    0

    - PWM1    1

    - PWM2    2

    - PWM3    3

    - PWM4    4
  - period: PWM period, count in microsecond
  - high: PWM high time, count in microsecond

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x09, 0xFC, <status>` 

1.  ### Stop PWM
    Stop PWM
    Command: `0x01, 0x0A, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x0A, 0xFC, <status>`   

2.  ### Set RTC32K Output
    Output RTC32K signal on specail GPIO. Available pins are GPIO_0_2, GPIO_0_6, GPIO_1_0, GPIO_1_4, GPIO_1_8, GPIO_3_3 and GPIO_4_3.
    Command: `0x01, 0x46, 0xFC, 0x03, <enable>, <port>, <pin>`
- enable: 1 is enable, and 0 is disable
- port: GPIO port
- pin: GPIO pin
	
	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x46, 0xFC, <status>` 


Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x09, 0xFC, <status>` 	

1.  ### I2C Read Register
    I2C read register as master
    Command: `0x01, 0x59, 0xFC, 0x03, <i2c_id>, <slv_addr>, <reg_addr>`
- i2c_id: I2C id, 0 or 1. I2C 0 use GPIO0_0 and GPIO0_1, I2C 1 use GPIO4_0 and GPIO4_1.
- slv_addr: I2C slave address
- reg_addr: register address


	Complete Event: `0x04, 0x0E, 0x04, 0x02, 0x59, 0xFC, <status>, <reg_val>`   
- reg_val: register value
  
1.  ### Get RTC clock
    I2C read register as master
    Command: `0x01, 0x5A, 0xFC, 0x00`

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x5A, 0xFC, <status>, <rtc_clk byte 0>, <rtc_clk byte 1>, <rtc_clk byte 2>, <rtc_clk byte 3>`   
- rtc_clk: RTC clock in HZ.

1.  ### Deep Sleep
    Go to deep sleep mode
    Command: `0x01, 0x55, 0xFC, 0x04, <sleep_time byte 0>, <sleep_time byte 1>, <sleep_time byte 2>, <sleep_time byte 3>`
- sleep_time: sleep time in millisecond, must larger then 10.  Chip will wake up after sleep_time. 

	Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x55, 0xFC, <status>`   

***The following command in only available for Golden tester board.***

1.  ### DUT Calibrate XO
    
    Command: `0x01, 0x31, 0xFC, 0x03, <pwm id>, <save>, <limit>`

	Calibrate XO with PWM signal.

- pwm id:

  - PWM0    0

  - PWM1    1

  - PWM2    2

  - PWM3    3

  - PWM4    4

- save: 

  - 0: don’t save cap value.

  - 1: save cap value on flash.

- limit: Max offset between DUT and tester. Unit is 1/8 us at 100ms(1.25PPM).

For example, limit is 16, means that offset is  ±2us at every 100ms(20 PPM).

Complete Event: `0x04, 0x0E, 0x06, 0x01, 0x31, 0xFC, <status>,<cap>,<offset>` 

- cap: cap value

- offset: Offset between DUT and tester , Unit is 1/8 us at 100ms(1.25PPM).
22. ### DUT Set TX Power
    
    Command: `0x01, 0x32, 0xFC, 0x03, <ch>, <phy>, <tx gain code>`
- ch: 0 ~ 39
- phy: Please refer to Table 2
- tx gain: DUT tx gain code(0x0 ~ 0x7F), only available for carrier.

Complete Event: `0x04, 0x0E, 0x05, 0x01, 0x32, 0xFC, <status>,<rssi>` 

- rssi: RSSI value
23. ### DUT RX Sensitivity
    
    Command: `0x01, 0x33, 0xFC, 0x03, <ch>, <phy>, <loss rate>`
- ch: 0 ~ 39

- phy: Please refer to Table 2

- loss rate:  0~255, unit is 0.1%.  For example ,20 means 2%

Complete Event: `0x04, 0x0E, 0x01, 0x06, 0x33, 0xFC, <status>, <tx power>, <loss rate>`

- tx power: Tester TX power

- loss rate: loss rate, unit is 0.1%.  20 means 2%.
24. ### DUT Download Image
    
    Command: `0x01, 0x34, 0xFC, 0x08, <bootram size byte 0>, <bootram size byte 1>, <bootram size byte 2>, <bootram size byte 3>, <image size byte 0>, <image size byte 1>, <image size byte 2>, <image size byte 3>`
    
    - bootram size: bootram size. Default is 0x2000.
    - image size: application image size.

Example: bootram size is 0x2000 bytes, image size is 0xAC00 bytes:

01 34 fc 08 00 20 00 00 00 ac 00 00

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x34, 0xFC, <status>`

25. ### Start BLE Scan
    
    Command: `0x01, 0x40, 0xFC, 0x07, <channel>, <BD addr byte 0>, < BD addr byte 1>, < BD addr byte 2>, < BD addr byte 3 >, < BD addr byte 4>, < BD addr byte 5 >`
- channel: Scan channel. 37, 38 or 39

- BD addr: BLE device address, 6 bytes

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x40, 0xFC, <status>`

26. ### Start SDR Scan
    
    Command: `0x01, 0x41, 0xFC, 0x05, <channel>, <access addr byte 0>, <access addr byte 1>, <access addr byte 2>, <access addr byte 3 >`
- channel:Scan channel. Range is 0 ~  39.

- addcess addr: SDR access address, 4 bytes

Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x41, 0xFC, <status>`

27. ### Stop Scan
    
    Command: `0x01, 0x42, 0xFC, 0x00`

Complete Event: `0x04, 0x0E, 0x01, 0x01, 0x41, 0xFC, <status>, <RSSI>,<freq_offset_code byte 0 >, < freq_offset_code byte 1 >, <receive packet number byte 0>, <receive packet number byte 1>`

- RSSI: value of RSSI, int8\_t. Example: return value is 0xCD, RSSI=0xCD-0x100=-51dBm

- freq offset code: frequency offset code. It is int16\_t value. Use this to covert to KHz:

`Offset(KHz) = 500.0/1024* freq_offset_code` 
Complete Event: `0x04, 0x0E, 0x04, 0x01, 0x42, 0xFC, <status>`