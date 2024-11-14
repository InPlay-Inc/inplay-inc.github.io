---
title: "Introduction"
---

# Introduction to MultiConnNet System
---

The MultiConnNet is Inplay's proprietary Multi-Connection Private Network system. It is a 2.4GHz wireless communication network based on a private SDR (Software Defined Radio) protocol, utilizing a one-to-many star connection topology.

The system is comprised of two primary components: the gateway module and the node module.

## Key Features ##
- **Star Topology:** The system employs a star connection model, with the gateway serving as the central node for bidirectional communication with multiple node modules, facilitating management and data transmission.

- **Multi-Node Connectable:** The MultiConnNet supports up to 128 nodes in network, making it suitable for large-scale deployments and meeting diverse application needs. Besides, all the nodes is connectable, which offers high reliability and data integrity on specific application.

- **Bidirectional Data Transmission:** The system enables bidirectional data transmission, ensuring real-time communication between nodes and the gateway, which is ideal for applications requiring quick responses.

- **Private SDR Protocol:** Based on a private SDR protocol, the system offers greater flexibility and customization, allowing optimization according to specific requirements to enhance communication efficiency.

- **Spectrum Utilization:** Operating in the 2.4GHz frequency band, it effectively utilizes existing wireless spectrum resources, making it suitable for various indoor and outdoor environments.

## Glossary of Acronyms and Important Terms ##

**Access Address:**&emsp;All low level packets include the 4 octets Access Address, which is used to identify communications on a physical channel, and to exclude or ignore packets on different physical channels that are using the same PHY channels in physical proximity. This ensures that the transmission is indeed meant for the device that is receiving it.

**Device Address:**&emsp;Each device in the MultiConnNet has its own 2 octets Device Address, which is used as source/target addresses for communication between the gateway and each node.

**Gateway:**&emsp;The Gateway is the center device of the network, connecting and managing the surrounding node devices. It can connect up to 128 nodes simultaneously, operating at full capacity without entering a low-power sleep mode.

**Node:**&emsp;Node is peripheral device that connect to the network where the gateway is located after logging in. The nodes operate in a low-power state.

**Periodic Advertising:**&emsp;Gateway sends periodic advertisement packets at regular intervals for synchronization of various nodes within the network. The interval at which the advertising packets are sent can be configured, allowing for flexibility based on application requirements.

**Network Pairing:**&emsp;Before the Node connects to Gateway, it sends its own information to the Gateway under a public Access Address and physical channel while also receiving network parameters from the gateway to establish the connection. This procedure is called Network Pairing.

**Connection Interval:**&emsp;After the nodes connect to the gateway, they will communicate periodically to determine the connection status; a timeout will indicate a disconnection. This period is called the connection interval. It must be a power of 2 multiple of the periodic advertising interval.

## Network Capacity ##

In MultiConnNet, the relationship between the Connection Interval and the Periodic Advertising Interval directly affects the connection capacity of nodes. Specifically, the Connection Interval must be a power of 2 multiple of the Periodic Advertising Interval.

**Maximum Nodes per Interval:**

Each periodic advertising interval corresponds to a specific maximum connection interval, which is determined by the formula

        Maximum Connection Interval = Periodic Advertising Interval×16
        Minimum Connection Interval = Periodic Advertising Interval

Each connection interval has a maximum number of nodes it can support. This capacity is fixed and should be considered when designing the network.

Assuming the Periodic Advertising Interval is 50 milliseconds (ms), the following table lists available connection interval and corresponding maximum node count:

<table width="100%" border="0" style="width: 80%;margin:auto">
    <tr>
        <th width="50%" align="center" bgcolor="#cccccc"><font size="1">Connection Interval (ms)</font></th>
        <th width="50%" align="center" bgcolor="#cccccc"><font size="1">Maximum connectable nodes</font></th>
    </tr>
    <tr>
        <td><font size="0">800</font></td>
        <td><font size="0">128</font></td>
    </tr>
    <tr>
        <td><font size="0">400</font></td>
        <td><font size="0">64</font></td>
    </tr>
    <tr>
        <td><font size="0">200</font></td>
        <td><font size="0">32</font></td>
    </tr>
    <tr>
        <td><font size="0">100</font></td>
        <td><font size="0">16</font></td>
    </tr>
    <tr>
        <td><font size="0">50</font></td>
        <td><font size="0">8</font></td>
    </tr>
</table>

**Mixed Connection Interval Trade-offs:**

When you introduce nodes with shorter connection intervals, the total number of nodes must be adjusted accordingly. For instance:

- If you have 1 node with a 400 ms interval, you can only have 126 nodes with an 800 ms interval.
- Similarly, if you have 1 node with a 200 ms interval, you can have 124 nodes with an 800 ms interval (128 - 2).

Generally, to determine the maximum number of nodes in a mixed connection interval scenario, you can follow this approach:

![alt text](/images/solution/MultiConnNet/node_count_formular.png)

The formula states that the total time required by all nodes in the network (calculated as the sum of the time each type of node takes based on its connection interval and count) should not exceed the maximum allowable time frame represented by 16 × 8.

![alt text](/images/solution/MultiConnNet/node_count_example.png)

**Conclusion:**

Using this formula allows you to effectively manage and calculate the maximum allowable nodes in a MultiConnNet network with mixed connection intervals. Always ensure that the total time required by all nodes does not exceed the calculated limit, allowing for optimal network performance.

## Data Throughput ##

Data throughput is dependent on connection interval. Lower connection interval, higher data throughput. Here is fomular that is used to estimate approximate data rate.

![alt text](/images/solution/MultiConnNet/throughput_formular.png)

The maximum data rate will be (1000/50)*251 ≈ 5KBps when connection interval is 50 ms.

## Power Consumption ##

The Gateway is in full operation mode while node is cable of entering low power mode. It is also dependent on connection interval. Lower connection interval, higher power consumption. For maximum 800ms connection interval, node's average current can be lower than 48uA.

![alt text](/images/solution/MultiConnNet/ave_current_800ms_conn_intv.png)