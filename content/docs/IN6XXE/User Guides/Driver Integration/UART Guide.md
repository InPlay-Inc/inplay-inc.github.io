---
title: "UART Communication"
---
## UART Guide

### Overview

The Universal Asynchronous Receiver-Transmitter (UART) is a hardware communication protocol that enables serial data transmission between devices. It is widely used for communication between microcontrollers and various peripherals, such as computers, sensors, and other embedded systems.

### Initialization

Before using the UART interface, it needs to be properly initialized. Configure the UART settings according to the `uart_init_t` struct:

```c
uart_init_t init = {0};
init.baud_rate = 115200;        /**< Baud rate (e.g., 9600, 115200, etc.) */
init.data_len = 8;              /**< Data length (5, 6, 7, or 8 bits) */
init.stop_bit = 1;              /**< Stop bit (1 or 2 bits) */
init.parity_en = 0;             /**< Enable parity bit (0: disabled, 1: enabled) */
init.even_parity = 0;           /**< Parity type (0: odd, 1: even) */

init.fc = 0;                    /**< Flow control (0: disabled, 1: enabled) */
init.no_intr = 0;               /**< Interrupt mode (0: enabled, 1: disabled) */
init.prio = IRQ_PRI_Normal;     /**< Interrupt priority */

init.rx_arg = NULL;             /**< Argument for RX callback */
init.rx_cb = rx_cb;             /**< RX callback function */
init.tx_arg = NULL;             /**< Argument for TX callback */
init.tx_cb = tx_cb;             /**< TX callback function */

uart_hdl = hal_uart_open(UART0_ID, &init);
```

### UART Transmission

#### UART TX by Interrupt

```c
res = hal_uart_tx(hdl, buffer, buffer_len, poll);
/**
 * @brief UART TX by interrupt
 * @note This function can be in either block or non-block mode. If TX completion callback function is not specified, this function will be blocked until TX completed. Otherwise, this function will return (non-block) without waiting for the TX completion. Later on, the TX completion callback function will be called from the driver's interrupt service routine to indicate transfer completed, the exact transmit bytes, and any errors.
 *
 * @param[in] hdl           Uart handle from the open API
 * @param[in] buffer        Data buffer to TX
 * @param[in] buffer_len    Data buffer length
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 *
 * @return Driver error return code, @see enum uart_err
 */
```

#### UART TX by DMA

```c
res = hal_uart_tx_dma(hdl, buffer, buffer_len, poll);
/**
 * @brief UART TX by DMA
 * @param[in] hdl           Uart handle from the open API
 * @param[in] buffer        Data buffer pointer for TX
 * @param[in] buffer_len    Data buffer length. Max 2047 for DMA transmission.
 * @param[in] poll          0: interrupt mode, 1: polling mode, disable interrupt in polling mode.
 *
 * @return Driver error return code, @see enum uart_err
 */
```

### UART Reception

#### UART RX by Interrupt

```c
res = hal_uart_rx(hdl, buffer, buffer_len, poll, tmo, actual_rx_len);
/**
 * @brief UART RX by interrupt
 * @note This function can be in either block or non-block mode. If RX completion callback function is not specified, this function will be blocked until RX completed. Otherwise, this function will return (non-block) without waiting for the RX completion. Later on, the RX completion callback function will be called from the driver's interrupt service routine to indicate transfer completed, the exact receive bytes, and any errors.
 *
 * @param[in] hdl           Uart handle from the open API
 * @param[in] buffer        Data buffer to RX
 * @param[in] buffer_len    Data buffer length
 * @param[in] poll          0: interrupt mode, 1: polling mode.
 * @param[in] tmo           Timeout for block call. 0: means non-block call, need to set callback function.
 * @param[out] actual_rx_len Blocking call return the exact RX bytes
 *
 * @return Driver error return code, @see enum uart_err
 */
```

#### UART RX by DMA

```c
res = hal_uart_rx_dma(hdl, buffer, buffer_len, poll, tmo, actual_rx_len);
/**
 * @brief UART RX by DMA
 * @param[in] hdl           Uart handle from the open API
 * @param[in] buffer        Data buffer pointer for RX
 * @param[in] buffer_len    Data buffer length. Max 2047 for DMA transmission.
 * @param[in] poll          0: interrupt mode, 1: polling mode, disable interrupt in polling mode.
 * @param[in] tmo           Timeout for block call, 0: means non-block call, need to set callback function.
 * @param[out] actual_rx_len Blocking call return the exact RX bytes
 *
 * @return Driver error return code, @see enum uart_err
 */
```

#### Cancel UART RX

```c
res = hal_uart_cancel_rx(hdl);
/**
 * @brief Cancel UART RX
 * @note This function is used for both DMA and non-DMA modes.
 * @param[in] hdl           The handle from the previous "open" function.
 * @return Driver error return code, @see enum uart_err
 */
```

