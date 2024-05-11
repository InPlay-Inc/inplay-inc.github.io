---
title: "GPIO Guide"
---
# GPIO Guide
## Overview

The GPIO (General Purpose Input/Output) is organized into five ports. And there are two types of GPIOs: mixed-signal GPIOs and digital GPIOs:
- Digital GPIO:
	- Port: Port 0, port 1, port 3 and port 4
	- Can NOT be used as sensor ADC input
- Mixed GPIO:
	- Port: Port 2
	- Can be used as sensor ADC input

## Output / Input
Refer to "proj_drv_gpio".

Configure GPIO to output and output high/low:
```
	int level = 0;
	hal_gpio_cfg_output(port, poin);
	hal_gpio_output(port, poin, level);
	
```

Configure GPIO to input and get input value:
```
	int level;
	hal_gpio_cfg_input(port, poin, GPIO_PULL_UP);
	level = hal_gpio_input_status(port, poin);
	
```
## Interrupt
Each pin in one group share the same interrupt. Supports falling edge, rising edge and both edge.

Refer to "proj_drv_gpio_interrupt".

Configure interrupt for falling edge and rising edge:
```
	hal_gpio_cfg_input(port, pin, GPIO_NO_PULL);
	hal_gpio_ext_int_prio(port, IRQ_PRI_Normal);
	hal_gpio_ext_int_reg(port, pin, NULL, gpio_intr_cb);
	hal_gpio_ext_int_unmask(port, pin, 1, 1, 0);
```
## Wake up
All pins can be configured to wake up the chip by high level, low level, falling edge, rising edge, and both edges.

Refer to "proj_drv_gpio_wup".

Configure to wake up by rising edge:
```
	hal_gpio_cfg_input(port, pin, GPIO_PULL_DOWN);
	hal_gpio_cfg_wup_edge(port, pin, 1, 0);
```

To output in sleep mode, set latch to 1:
```
	//output high in deep sleep and wake up
	hal_gpio_cfg_output(port, pin);
	hal_gpio_output(port, pin, 1);
	hal_gpio_sleep_pad_latch(port, pin, 1, 0);
```

## Wake up and get interrupt
After waking up, it can generate interrupt.

Refer to "proj_drv_gpio_wup_interrupt"

```
	/// interrupt
	/// falling edge , wake up en
	hal_gpio_ext_int_prio(port, IRQ_PRI_Normal);
	hal_gpio_ext_int_reg(port, pin, NULL, gpio_intr_cb);
	hal_gpio_ext_int_unmask(port, pin, 0, 1, 1);
	
	/// wake up by edge
	///	falling edge
	hal_gpio_cfg_wup_edge(port, pin, 0, 1);
```

## Reset chip/CPU
GPIO pin can be configured to reset the chip/CPU by falling edge or rising edge.

Refer to "proj_drv_gpio_reset".

Reset chip by falling edge
```
	hal_gpio_cfg_input(port, pin, GPIO_PULL_UP);
	hal_gpio_reset_chip(port, pin, port, pin, 1, 16);
```






