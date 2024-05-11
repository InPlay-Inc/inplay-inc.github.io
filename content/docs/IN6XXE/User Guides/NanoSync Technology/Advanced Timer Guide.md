---
weight: 1
title: "NanoSync Timer Guide"
---

# NanoSync Timer Guide
## Introduction 
The NanoSync timers(Advanced Timer) are capable of capturing the times of multiple real-time triggers or events simultaneously. The NanoSync timers can be also used as trigger sources for the NanoSync engine(Trigger Handler).
If the current time of a NanoSync timer equals to the programmed target time (called emit time), a trigger (We also call the trigger from SyncTimer as an emit) happens. Each SyncTimer supports up to 10 emit time target. The emits also support direct control of a GPIO output without any latency.

## Basic Timer
The timer0 to timer9 are basic timers, which support timeout functionality  and  manual counting.

## NanoSync Timer(Advanced Timer)
Timer 0, timer 1 and timer 6 are advanced timer, supporting capture and emit functionalities. 
### Capture
Advanced timers can capture signals, obtaining timestamps of the signals' rising or falling edges. These signals can be GPIO inputs or BLE TRX signals, refer to the Trigger (NanoSync Engine) document for signal details. Each timer can capture up to 4 signals simultaneously.

### Emit
Advanced timers can emit a signal when they reach the target timestamp. The trigger handler can use this emitted signal as input. Each advanced timer can emit up to 10 signals.

### Output emit signal on GPIO
Using testmux, it's possible to output emitted signals on GPIO. Each advanced timer can output up to 10 emit signals and 5 toggle emit signals. The emit signal is a pulse signal, and two emit signals combine to produce one toggle emit signal, controlling both its rising and falling edges.

### Capture and Emit with Shared memory
Advanced timers can use shared memory to capture and emit signals. With shared memory, it can capture one signal and emit one signal simultaneously. For instance, it can capture signal 0 and write its timestamp to shared memory, and emitting signal 0 with the timestamp stored in shared memory.

## API
See [Timer API Document](https://inplay-inc.github.io/API%20Doc/html/group___h_a_l___t_r_i_g.html) for details.




