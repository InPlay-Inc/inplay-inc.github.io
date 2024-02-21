# AES Example Guide

## Overview

AES encryption, also known as Advanced Encryption Standard, is a widely used encryption algorithm. It is considered to be one of the most secure and advanced encryption algorithms in the world.

AES encryption is a symmetric encryption algorithm based on a key. It uses 128-bit, 192-bit or 256-bit keys to encrypt data. This means that as long as the key is known, the encrypted data can be decrypted. AES encryption has three modes: ECB (Electronic Codebook), CBC (Cipher Block Chaining), and CFB (Cipher Feedback).



## Hardware Requirements

| Hardware  | Project Name | Project Path                    |
| --------- | ------------ | ------------------------------- |
| IN628E DK | proj_drv_aes | in-dev/proj/driver/proj_drv_aes |



## Building

To build the sample with keil, follow the steps listed on the [quick start](https://inplay-inc.github.io/docs/in6xxe/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of encryption to UART Log. If test pass, `...passed` or `... successed  `will be shown on UART log.

More information may be found in  [debug guide](https://inplay-inc.github.io/docs/in6xxe/samples/Debug-Guide) page.



## Testing Steps

1. Open Keil, download **proj_drv_aes**.
2. Press the reset button and observe the log for the message `main start...`.
3. The status of encryption will be shown on UART log.