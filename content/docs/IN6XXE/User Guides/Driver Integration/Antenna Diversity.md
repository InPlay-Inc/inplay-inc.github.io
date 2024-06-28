---
title: "Antenna Diversity"
---
# Antenna Diversity
## Overview

The antenna diversity engine supports signal RSSI evaluation and antenna switching, and it supports both dual and 4 antennas. Signal evaluation and antenna switching are performed in the background by the chip's hardware modules.

## API
#### initialization.
```
int hal_ana_diversity_init(uint8_t num_ants, uint8_t frz_time, uint32_t agc_stable_time);

void hal_ann_2diversity_gpio25_invgpio00_sw_init(void);

void hal_ann_4diversity_gpio25_gpio26_sw_init(void);
```

## Example of Dual Antenna
```
int main(void)
{
    int res;
    uint8_t tx_buf[16];
    sdr_mstr_scan_t scan_cfg;
    hal_global_post_init();
    
    PRINTD(DBG_TRACE, "%s %s\r\n", __DATE__, __TIME__);
    PRINTD(DBG_TRACE, "CHIP ID = %08X\r\n", chip_get_id());
        	
    hal_ana_diversity_init(2, 40, 40);    
    hal_ann_2diversity_gpio25_invgpio00_sw_init();

    res = in_sdr_init();
    if (SDR_ERR_OK != res)
    {   
        PRINTD(DBG_ERR, "in_sdr_init failed %d\r\n", res);
        return 1;
    }
    scan_cfg.chn = 37;
    scan_cfg.txr = PHY_RATE_1M;
    scan_cfg.rxr = PHY_RATE_1M;
    scan_cfg.aa = 0x8E89BED6;
    scan_cfg.rxw_sz = 0x80ff;
    scan_cfg.rx_arg = NULL;
    scan_cfg.rx_callback = sdr_rx_callback;
    hw_ana_set_tx_power(TX_POWER_7);

    
    while (1) 
    {        
        res = in_sdr_mstr_scan(&scan_cfg, tx_buf, 0);
        if (SDR_ERR_OK != res)
        {
            PRINTD(DBG_ERR, "SDR scan failed %d\r\n", res);
        }
    }
    return 1;
}

```








