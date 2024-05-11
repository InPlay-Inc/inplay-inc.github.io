---
title: "SPI Communication"
---
# SPI Guide
## Overview

SPI, which stands for Serial Peripheral Interface, is a high-speed, full-duplex, synchronous communication bus that allows data transmission between a microcontroller and peripheral devices. It utilizes a master-slave model, with the master device controlling a set of slave devices. SPI requires four signal lines:
1. SCLK for synchronization

2. MOSI for data transmission from master to slave

3. MISO for data transmission from slave to master

4. SSN for selecting the slave device to communicate with. 



## Init
### Master

Refer to "proj_drv_spi_master".

Configure spi master:
```
	spi_config_t config = {0};
	config.dfs = SPI_DFS_8_BITS;  //data frame size
	config.cs = 0;  //slave select, only available for master SPI
	config.phase = 1;  //phase
	config.polarity = 1;  //polarity
	config.speed = 100000;  //speed in Hz, only available for master SPI
	config.intr_prio = IRQ_PRI_Normal;  //interrupt priority
	config.arg = NULL;  //The variables needed in callback
	config.callback = spi_callback;  //when spi process finished, callback set here will be invoked
	
	void *hdl = hal_spi_open(MSPI_ID, &config);  //use MSPI_ID when it play the role as spi master
```

### Slave

Refer to "proj_drv_spi_slave".

Configure spi slave:

```
	spi_config_t config = {0};
	config.dfs = SPI_DFS_8_BITS;  //data frame size
	config.phase = 1;  //phase
	config.polarity = 1;  //polarity
	config.intr_prio = IRQ_PRI_Normal;  //interrupt priority
	config.arg = NULL;  //The variables needed in callback
	config.callback = spi_callback;  //when spi process finished, callback set here will be invoked
	config.trig_queue = TRIG_HP_QUEUE;  //trigger queue
	void *hdl = hal_spi_open(SSPI1_ID, &config);
	
```


## Output(TX)

If data needs to be transferred from MOSI(when using master tx) or MISO(when using slave tx), we can use `hal_spi_tx`. We can set a timeout when we require a timeout to interrupt the SPI process in case of a delay, or we can simply set a callback during SPI initialization when there is no need for interruption.

If we want a faster speed, we can use the DMA mode, that is, replacing `hal_spi_tx` with `hal_spi_tx_dma`.

```
	static uint8_t tx_buf[256];
	
	int ret = 0;
	for (int i = 0; i < sizeof(tx_buf); i++) {
		tx_buf[i] = i;
	}

	memset(rx_buf, 0, sizeof(rx_buf));
	ret = hal_spi_tx(hdl, tx_buf, sizeof(tx_buf), 0, APP_SPI_TIMEOUT, &trx_len);
	/*
	int hal_spi_tx(void *hdl, void *buffer, uint16_t buffer_len, int poll, uint32_t tmo, uint16_t *actual_size);
	*hdl: handle return when we use hal_spi_open
	*buffer: buffer need to tx
	buffer_len: tx buffer length
	poll: if need to use poll.when use poll mode, timeout should not be set to 0.
	tmo: timeout for spi process.
	*actual_size: actual tx size.
	*/
	
```

## Input(RX)

If data needs to be received from MOSI(when using master tx) or MISO(when using slave tx), we can use `hal_spi_rx`. We can set a timeout when we require a timeout to interrupt the SPI process in case of a delay, or we can simply set a callback during SPI initialization when there is no need for interruption.

If we want a faster speed, we can use the DMA mode, that is, replacing `hal_spi_rx` with `hal_spi_rx_dma`.

```
	static uint8_t rx_buf[256];
	
	int ret = 0;
	for (int i = 0; i < sizeof(tx_buf); i++) {
		tx_buf[i] = i;
	}

	memset(rx_buf, 0, sizeof(rx_buf));
	ret = hal_spi_rx(hdl, rx_buf, sizeof(tx_buf), 0, APP_SPI_TIMEOUT, &trx_len);	
	  
	/*
	int hal_spi_Rx(void *hdl, void *buffer, uint16_t buffer_len, int poll, uint32_t tmo, uint16_t *actual_size);
	*hdl: handle return when we use hal_spi_open
	*buffer: buffer recived
	buffer_len: rx buffer length
	poll: if need to use poll.when use poll mode, timeout should not be set to 0.
	tmo: timeout for spi process
	*actual_size: actual rx size
	*/
	
```

## TRX

If bidirectional data transmission is required, we can use `hal_spi_trx`. We can set a timeout when we require a timeout to interrupt the SPI process in case of a delay, or we can simply set a callback during SPI initialization when there is no need for interruption.

```
	static uint8_t tx_buf[256];
	static uint8_t rx_buf[256];
	uint16_t trx_len = 0;
	int ret = 0;
	for (int i = 0; i < sizeof(tx_buf); i++) {
		tx_buf[i] = i;
	}

	memset(rx_buf, 0, sizeof(rx_buf));
	ret = hal_spi_trx(hdl, tx_buf, rx_buf, sizeof(tx_buf), 0, APP_SPI_TIMEOUT, &trx_len);		
	/*
	int hal_spi_trx(void *hdl, void *wbuf, void *rbuf, uint16_t buffer_len, int poll, uint32_t tmo, uint16_t *actual_size);
	*hdl: handle return when we use hal_spi_open
	*wbuf: buffer need to transfer
	*rbuf: buffer received
	buffer_len: rx buffer length
	poll: if need to use poll.when use poll mode, timeout should not be set to 0.
	tmo: timeout for spi process
	*actual_size: actual rx size
	*/

```

## Cancel SPI process

when we want to stop and cancel spi process, we can use `hal_spi_cancel`.

```
int ret = hal_spi_cancel(hdl);  //hdl: handle return when we use hal_spi_open 
```

## Close SPI

when SPI case finished, we can close SPI device with `hal_spi_close`.

```
int ret = hal_spi_close(hdl);  //hdl: handle return when we use hal_spi_open
```

