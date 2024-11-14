---
title: "User Guild"
---

# MultiConnNet User Guild
---

Proper module configuration is essential before the MultiConnNet network can operate normally. However, it is necessary to understand the essential information beforehand.

- **Boot Mode:** The module can enter Boot mode when GPIO_0_4 is connected to GND during power-up or reset, allowing for firmware flashing, storage resetting, and other operations.

- **Interactive Interface:** By default, UART1 is used as interface between HOST and module, with GPIO_2_1 and GPIO_2_7 as TX and RX function, 921600 baud rate, 8N1. This can be reconfigured.

- **Log Interface:** By default, UART0 is used as log interface, with GPIO_0_2 as TX function, 921600 baud rate, 8N1. If interactive interface is changed, log interface changed automatically. For example, if interactive interface change to UART0，log interface will change to UART1 with GPIO_2_1 as TX function.

- **PA Control IO:** By default, GPIO_3_3 is used as TX enable function and GPIO_2_5 as RX enable function, no BIAS control. It can be reconfigured.

## Configuration ##

The module is in a non-operational state until the network parameters are configured. There are two methods to configure the module's network parameters: real-time configuration through the interactive interface, and static configuration via BLE connection. Regardless of the method used, the configuration commands are the same as what are documented in MultiConnNet Instruction Set.

### Real-Time Configuration ###

During real-time configuration, once the system is powered on and the module is ready (ready event sent), the HOST can send commands to the module through the interactive interface to configure and start the module, allowing it to operate as required. By sending different configuration parameters each time the module is powered on, different operations can be executed, hence the term "real-time configuration."

### BLE Connection Static Configuration ###

When the module is in a non-operational state, it will start a connectable BLE advertisement. When a Master device, such as a smartphone, connects to the module, it can send commands to the module via the corresponding GATT Service to configure and start the module, enabling it to work as required.

Generally, configuration commands are sent first, followed by Run command to start the operation to test if the module operates correctly. Then restart the module and repeat the previous configuration, and store them. After that, when the module is powered on, it will automatically run, hence the term "static configuration." Once the module can run automatically, it can only receive the corresponding commands through real-time configuration.

Here is an example of the configuration steps for the gateway and node using the nRF Connect app on a smartphone.

#### <u>Gateway Configuration</u> ####

**Step 1:** Scan for the broadcast named "gateway" and click "connect" to establish a connection.

**Step 2:** Once connected, a GATT service for configuration commands will appear.

**Step 3:** Send the _**Network Parameter Configuration**_ command <mark>4A 05 1 01 23 45 67 AB AB AB AB 01 00 00 10 32 00 40 00</mark> by GATT Write method, to configure gateway’s network parameters. The response to this command is sent back by GATT Notify method. 

![alt text](/images/solution/MultiConnNet/gw_cfg_by_phone.png)

**Step 4:** If everything goes well, restart the gateway and repeat Steps 1 to 3. Finally, send _**Reset**_ command <mark>4A 01 01 02</mark> by GATT Write method, to save configuration before reboot. Then it will automatically run, even after power lost.

For detailed parameters in above command, please refer to the instruction set documentation.

#### <u>Node Configuration</u> ####

**Step 1:** Scan for the broadcast named "node" and click "connect" to establish a connection.

**Step 2:** Once connected, a GATT service for configuration commands will appear.

**Step 3:** Send the _**Network Parameter Configuration**_ command <mark>4A 05 15 00 01 00 10 AB AB AB AB 25 20 03 20 4E 00 00 32 00 00 00 00 00</mark> by GATT Write method, to configure the node’s network parameters. The response to this command is sent back by GATT Notify method. In this example, node’s device address is 0x0100. For configuring other nodes, this address must be different.

![alt text](/images/solution/MultiConnNet/nd_cfg_by_phone.png)

**Step 4 (option):** Send the _**GPIO Input Configuration**_ command <mark>4A 07 04 04 01 00 01</mark> by GATT Write method, to configure node’s GPIO_0_4 as input function and send its GPIO Input Trigger event to remote Gateway.

**Step 5:** Send the _**Run**_ command <mark>4A 08 01 01 by</mark> GATT Write method, to start operation to test if previous configurations work correctly. Optionally, pull GPIO_0_4 to ground to trigger GPIO input event and remote gateway should receive corresponding event.

Step 6: If everything goes well, restart the node and repeat Steps 1 to 4. Finally, send _**Reset**_ command <mark>4A 01 01 02</mark> by GATT Write method, to save configuration before reboot. Then it will automatically run, log into the gateway, and maintain the connection, even after power lost.

#### <u>Reset Configuration</u> ####

There are two methods to reset the module:

**1. Real-time via Interactive Interface:** Send the _**Reset**_ command <mark>4A 01 01 01</mark> to the module through the interactive interface, with the option parameter set to 1. For detailed instructions, please refer to the [MultiConnNet Module Instruction Set](https://inplay-inc.github.io/docs/solutions/MultiConnNet/command-set.html).

**2. Reset via JLINK:** Use the Segger J-Flash tool to erase the Flash memory. For specific instructions on using the tool, refer to the [JFlash Programming Guide](https://inplay-inc.github.io/docs/in6xxe/getting-started/download/jflash-download-guide.html). Execute the following command to erase the Flash at the specified address:

![alt text](/images/solution/MultiConnNet/segger_jflash_1.png)

![alt text](/images/solution/MultiConnNet/segger_jflash_2.png)

![alt text](/images/solution/MultiConnNet/segger_jflash_3.png)

## GPIO Control ##

If optionally _**GPIO Input Configuration**_ command is sent to node model (Step 4 in Node's Configuration), the corresponding _**GPIO Input Trigger Event**_ is sent to either local HOST or the remote gateway after being triggered locally, depending on the target field in the command.

Here is gateway log snapshot:

![alt text](/images/solution/MultiConnNet/gw_log_remote_gpio_input_event.png)

Accordingly, Gateway can also use _**GPIO Output**_ command to control either local or remote node's GPIO output level, depending on the "target device address" field in command. For example, send <mark>4A 0A 04 04 01 00 01</mark> to gateway to output GPIO_0_4 high on the node device of 0x0100. If there is a LED driven by GPIO_0_4 on node, LED can be turned on or off remotely.

## Low Power Mode ##

The Node's UART Rx signal of the interactive interface needs to be grounded manually, for example GPIO_2_7, to let driver stop working and then module is able to enter sleep mode. Setting the UART Rx signal of the interactive interface to high can wake the module up from sleep mode, and communication recovers.

## Data transmission ##

Data transmission can be categorized into two types: one is the remote control functionality like discussed earlier using GPIO control; the other is real-time data transmission via the interactive interface (UART) through sending data commands. For detailed commands, please refer to the instruction set documentation.

Due to the remote control functionality in GPIO control, please ensure that the data sent by real-time data transmission does not start with 0x4A or 0xA4, to avoid the module mistakenly interpreting it as its own command.

## Demo Host Implementation on Windows ##

TBD