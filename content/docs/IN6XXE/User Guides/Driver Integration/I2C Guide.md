---
title: "I2C Communication"
---

## I2C Guide

### Overview

- I2C (Inter-Integrated Circuit) is a simple serial communication protocol commonly used to connect microcontrollers with various electronic devices such as sensors and memories. It utilizes only two wires: a clock line (SCL) for synchronizing data transfer and a data line (SDA) for sending and receiving data.

## Key Features

- **Multi-Master Capability**: Multiple masters can be connected to the same bus and communicate with different slave devices.
- **Hardware Address Detection**: Each device on the I2C bus has a unique address, allowing for easy identification and communication.
- **Arbitration and Synchronization**: The I2C protocol includes mechanisms for arbitration and synchronization, ensuring reliable data transfer even when multiple masters are present on the bus.
- **Software Addressable**: The I2C protocol supports software-addressable devices, allowing for flexible configuration and dynamic address assignment.

## I2C Bus Topology

The I2C bus consists of two main components:



1. **Master Device**: The master device initiates and controls the communication on the I2C bus. It generates the clock signal and determines which slave device to communicate with.
2. **Slave Device**: Slave devices are peripheral devices that respond to requests from the master device. They can transmit or receive data based on the master's instructions.

The SDA (Serial Data) line is used for bidirectional data transfer, while the SCL (Serial Clock) line is used for synchronizing the data transfer between the master and slave devices.

### Initialization

Refer to "proj_drv_I2C_master/proj_drv_I2C_slave".

Configure I2C settings according to the `i2c_init_t` struct.

```c
i2c_init_t init = {0};
init.prio = IRQ_PRI_Normal;     /**< Interrupt priority */
init.speed = I2C_SPEED_100K;    /**< I2C speed (more selections can be found in i2c_speed) */
init.arg = NULL;                /**< Argument to be used in the callback */
init.callback = I2C_cb;         /**< I2C callback after I2C operation is finished */
i2c_dev = hal_i2c_open(I2C0_ID, &init);   /**< I2C0_ID can be replaced with I2C1_ID. If changed, update the setting in config.h */
```

### I2C Master

1. **Clock Generation**: The master is responsible for generating the SCL (Serial Clock) signal, which synchronizes data transmission.
2. **Data Transfer Control**: The master controls the start and end of data transmission by sending START and STOP signals.
3. **Device Addressing**: Before data transmission, the master sends a 7-bit or 10-bit device address along with a read/write bit (R/W=1 for read, R/W=0 for write) to specify the intended operation.

#### Master Read

```c
res = hal_mi2c_read(hdl, tar, buffer, buffer_len, poll, tmo);
/**
 * @brief I2C master read
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */

res = hal_mi2c_read_dma(hdl, tar, buffer, cmd_buf, buffer_len, poll, tmo);
/**
 * @brief I2C master read
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[out] cmd_buf      I2C DMA command buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */
```

#### Master Write

```c
res = hal_mi2c_write(hdl, tar, buffer, buffer_len, poll, tmo);
/**
 * @brief I2C master write
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */

res = hal_mi2c_write_dma(hdl, tar, buffer, buffer_len, cmd_buf, poll, tmo);
/**
 * @brief I2C master write
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[out] cmd_buf      I2C DMA command buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */
```

### I2C Slave

1. **Data Reception and Transmission**: Once addressed by the master, the slave receives or transmits data based on the master's instructions.

#### Slave Read

```c
res = hal_si2c_read(hdl, tar, buffer, buffer_len, poll, tmo);
/**
 * @brief I2C slave read
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */

res = hal_si2c_read_dma(hdl, tar, buffer, cmd_buf, buffer_len, poll, tmo);
/**
 * @brief I2C slave read
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */
```

#### Slave Write

```c
res = hal_si2c_write(hdl, tar, buffer, buffer_len, poll, tmo);
/**
 * @brief I2C slave write
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */

res = hal_si2c_write_dma(hdl, tar, buffer, buffer_len, poll, tmo);
/**
 * @brief I2C slave write
 * @param[in] hdl           The handle from the previous "open" function.
 * @param[in] tar           The slave address.
 * @param[in] buffer        The pointer to the received buffer.
 * @param[out] cmd_buf      I2C DMA command buffer.
 * @param[in] buffer_len    The receive buffer length.
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout in ms.
 *
 * @note Get more information in hal_i2c.h. When poll is set to 1, interrupts and callbacks will not be used. If tmo is set to 0, a callback must be configured.
 * @return @see enum i2c_error for the possible return code.
 */
```

