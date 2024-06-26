---
title: "Keyboard Sample"
---

# Keyboard Sample

## Overview

A matrix keyboard is a type of keyboard that uses a grid of buttons or keys arranged in rows and columns. Each key is assigned a unique position within the grid, identified by the intersection of its row and column. When a key is pressed, the corresponding row and column are activated, and the microcontroller can detect the specific key based on the activated row and column.



## Hardware Requirements

| Hardware  | Project Name      | Project Path                         |
| --------- | ----------------- | ------------------------------------ |
| IN628E DK | proj_drv_keyboard | in-dev/proj/driver/proj_drv_keyboard |



## Building

To build the sample with keil, follow the steps listed on the  [quick start](https://inplay-inc.github.io/docs/in6xxe/getting-started/installation/quick-start.html) page in the IN6xxE  of Inplay Doc. You may be able to solve questions on that webpage.



## Debug

We can get the status of keyboard on uart log.

- **press button:** `press key: row:... col:...`
- **release button:** `release row:... col:...`

More information may be found in [debug guide](https://inplay-inc.github.io/docs/in6xxe/examples-and-use-case/debug-reference) page.



## Test Steps


1. Open Keil and download the **proj_drv_keyboard** project.
2. Press the reset button and observe the log for the text `CHIP ID =`.
3. Press the button, we will get the status **press button** . After that, we release the button, we will get the status **release button**