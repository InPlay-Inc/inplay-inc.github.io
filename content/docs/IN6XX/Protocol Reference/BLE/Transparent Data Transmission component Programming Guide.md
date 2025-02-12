---
title: "Transparent Data Transmission Component Programming Guide"
---

# Overview

The component documented here is a software component that utilizes BLE GATT protocol to fulfill transparent data transmission  over BLE devices. It is based on Inplay BLE application framework and provides set of simple APIs for the convenience of application development. Please refer to  [GATT Programming Guide](https://inplay-inc.github.io/docs//in6xx/protocol-reference/ble/gatt-programming-guide.html) for details.

The component consists of the Server and the Client part. The server is composed of GATT based services. It includes two characteristic values with one representing receiving (Rx) and the other representing sending (TX) and a client characteristic configuration descriptor. Once a client is connected, the server will notify the client of the maximum size of data transmission it supports through MTU exchange. The client obtains the handles of the characteristics including Rx, TX and Configure through the method of GATT Discover Service so that it can send data through the method of GATT Write. The server sends data to the other party through the method of GATT Notify.

All the functions of component must be called after BLE is initialized by ble_app_run(). 

# Server

Generally speeking, the peer who will generate data and provide it to the other peer without active request, will act as GATT server. The method in which server transmits data is called notify or indicate. These are included among in_trx_svc.c under *proj/common/util* directory.

To use the server of component, first step application should do is to call in_trx_svc_add to add GATT service to the server. Here is prototype of API.

```c
/**
 ****************************************************************************************
 * @brief Add trx service 
 *
 * @param[in] uuid				Customized service and characteristic UUID. If NULL, default UUIDs are used. 
 *								@see TRX_SVC_UUID, TRX_TX_UUID, TRX_RX_UUID
 * @param[in] start_hdl			Service's start attribute handle. If 0, start handle is allocated by protocol
 *								stack and returned. Otherwise, start handle is designated and function may 
 *								return failed if it is already allocated.
 * @param[in] max_data_len		max data size to transmit/receive
 * @param[in] rx_callback		This callback will be called in gatt write request funtion
 * @param[in] p_cbf				Event callback which is previously passed into ble_app_config().
 *
 * @return 						>0: Success. The value is service's start handle
 * 								<0: Fail. The absolute value represents possible error @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_svc_add(uint8_t uuid[3][INB_UUID_128_LEN], uint16_t start_hdl, int max_data_len, ble_app_cbf_t *p_cbf, int (*rx_callback)(int, uint8_t*, int));
```

If the service has security requirment, call following function to set security 

```c
/**
 ****************************************************************************************
 * @brief set service's SMP right
 *
 * @param[in] perm				permission @see enum inb_att_perm 
 *
 * @return						>=0: Success.
 *								<0:  Fail. The absolute value represents possible error @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_svc_set_perm(enum inb_att_perm perm);
```

Now Transparent Data Transmission service is created and application is able to transmit and receive data once it is connected with peer client.

The server transmits data to the client by:

```c
/**
 ****************************************************************************************
 * @brief Trx notify function 
 *
 * @param[in] conidx	ID allocated by BLE stack after the connection is established with peer device
 * @param[in] buf		notify data buffer
 * @param[in] len       notify data length
 * @param[in] ack   	gatt indicate method is used when true
 *
 * @return				>=0: Success.
 *						<0:  Fail. The absolute value represents possible error @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_notify(int conidx, uint8_t *buf, uint32_t len, bool ack);
```

Application is informed by **rx_callback** function when the data is received from the client.


```c
int (*rx_callback)(int conidx, uint8_t *p_data, int data_len) 
```

The first parameter of the callback function represents the ID allocated by BLE stack after the connection is established with peer device; the second refers to the data, while the third represents the data length. Note that this callback function is running at the internal task, it is not recommended to call other BLE APIs in the callback function.

# Client

Accordingly, the peer who will receive data and consume it from the other peer, will act as GATT client. The method in which client transmits data is called write. These are included among in_trx_client.c under *proj/common/util* directory.

Similar to server component, first step application should do is to call in_trx_clt_init to initialize client. Here is prototype of API.

```c
/**
 ****************************************************************************************
 * @brief Init trx client
 *
 * @param[in] svc_uuid			Service UUID
 * @param[in] start_hdl			Service's start attribute handle. If it is not 0, start handle 
 *								is designated and thus Service Discovery Procedure is not performed. 
 * @param[in] max_data_len		max data size to transmit/receive
 * @param[in] p_cbf             Event callback which is previously passed into ble_app_config().
 * @param[in] rx_callback		This callback will be called in gatt notification event
 *
 * @return						>0: Success. The value is service's start handle
 *								<0: Fail. The absolute value represents possible error @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_init(uint8_t svc_uuid[INB_UUID_128_LEN], uint16_t start_hdl, int max_data_len, ble_app_cbf_t *p_cbf, int (*rx_callback)(int, uint8_t*, int));
```

The param is very similar to server API *in_trx_svc_add*. The only small difference is that if start_hdl is 0, the client needs to initiate the SDP process to obtain information about the service, and the duration of this process depends on the size of the connection interval. The client will automatically adjust the connection parameters to the minimum before the SDP process to quickly complete it, and then adjust them back to the original application-defined connection parameters.

The SDP is started by calling *in_trx_clt_enable* when client divice is connected with peer server device and connection is acceptable.

```c
/**
 ****************************************************************************************
 * @brief Enable trx client
 *
 * @param[in] conidx		ID allocated by BLE stack after the connection is established 
 *							with peer device
 * @param[in] bd_addr		peer device's BLE mac address
 *
 * @return					>=0: Success.
 *							<0:  Fail. The absolute value represents possible error
								 @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_enable(int conidx, uint8_t bd_addr[BLE_BDADDR_LEN]);
```

It is usually called when GAP_EVT_CONN_REQ or GAP_EVT_BOND_REQ with its request as PAIRING_SUCCEED is recieved and corresponding  event handler is called. Here is sample in *proj_in_trx_client_UART* in SDK.

```c
int main(void)
{
    
    ...

    //Register application's event handler
    ble_app_cbf_t* cbf = ble_app_get_default_cb();
	cbf->gap.evt_conn_ind = ble_conn_ind;

    ...

static void ble_conn_ind(inb_evt_conn_req_t *p_req,  inb_conn_cfm_t *p_cfm)
{
	int ret;
	int i;
	conn_info_t *p_conn_info;

	//If it is in target_info, it must be a slave
	p_conn_info = conn_info_get_by_addr((bd_addr_t*)p_req->peer_addr.addr);
	if (p_conn_info)
	{
		p_conn_info->peer_conidx = p_req->conidx+1;
		p_conn_info->state = STATE_CONNECTED;
	
		//Only for Slave
		in_trx_clt_enable(p_req->conidx, p_req->peer_addr.addr);
	}
}    
```

Till now, client is ready to exchange data with peer server. To transmit data call:

```c
/**
 ****************************************************************************************
 * @brief Trx Client send function 
 *
 * &param[in] conidx		ID allocated by BLE stack after the connection is established
 * @param[in] ack			use GATT_WRITE_NO_RESPONSE write method if false
 * @param[in] buf			notify data buffer
 * @param[in] len       	notify data length
 *
 * @return Possible return @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_send(int conidx, bool ack, uint8_t *p_data, uint16_t data_len);
```

The parameters are the same as those of the server interface.

The application of Tranparent Data Transmission component can be summarized in the following UML Sequence Diagram:

![Tranparent Data Transmission Sequence Diagram](/images/in_trx_sequence_diagram.png)


