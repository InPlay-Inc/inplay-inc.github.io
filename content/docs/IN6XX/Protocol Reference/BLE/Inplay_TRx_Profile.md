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

## Client

Accordingly, the data consummer on the peer side will act as TRx client. The method with which client transmits data is called GATT write. The TRx client source code is included among *in_trx_clt.c* under *proj/common/util* directory in SDK.

Similarly, TRx client should be initialized first by:

```c
typedef struct {
	/// Service UUID
	uint8_t 		svc_uuid[INB_UUID_128_LEN];

	/// Service's start attribute handle.
	/// If not 0, it is known beforehand and Service Discovery Procedure (SDP) is not performed.
	uint16_t 		start_hdl;

	/// Client's MTU
	int 			max_data_len;

	/// This callback will be called in gatt notification event
	trx_rx_cb_t		rx_callback;

	/// This callback will be called when client is ready to send/receive data
	trx_state_cb_t	ready_callback;
} in_trx_clt_t;

/**
 ****************************************************************************************
 * @brief Init trx client. This must be called after BLE stack and system is initialized
 *
 * @param[in] p_trx_clt		Contains parameter for client @see in_trx_clt_t
 *
 * @return					>=0: Success.
 *							<0 : Fail. The absolute value represents possible error
 *								 @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_init(in_trx_clt_t *p_trx_clt);
```

The parameters are very similar to server service creatation function **in_trx_svc_add**. The only small difference is that if <code>start_hdl</code> is 0, the client will initiate the SDP procedure to obtain information about the service. Once it is done, <code>ready_callback</code> function is called so that application is informed whether or not TRx client is ready to work. The duration of SDP depends on the connection interval. The client will automatically adjust the connection interval to the minimum to fasten the SDP procedure, and then adjust them back to the original application-defined connection parameters when finished.

Here is the sample on how TRx client is initialized:

```c
	res = ble_app_run(cbf, comp_cbf);
	if (res != INB_ERR_NO_ERROR) {

		PRINTD(DBG_ERR, "failed initialize ble apis, %d...\n", res);
		goto out;
	}

	/**
	****************************************************************************************
	* @brief Initialize Client trx
	* @note get more information in in_trx_clt.h
	*
	****************************************************************************************
	*/
	in_trx_clt_t in_trx_clt = {.svc_uuid={TRX_SVC_UUID}, .start_hdl=0, .max_data_len=TRX_MAX_LEN, .rx_callback=trx_rx_cb, .ready_callback=trx_ready_cb};
	in_trx_clt_init(&in_trx_clt);
```

The SDP procedure is started by calling **in_trx_clt_start** when client device is connected with peer server device and connection is acceptable by application.

```c
/**
 ****************************************************************************************
 * @brief Start trx client once connection is confirmed. This must be called after
 * 		  in_trx_clt_init is called successfully.
 *
 * @param[in] conidx		ID allocated by BLE stack after the connection is established
 *							with peer device
 * @param[in] bd_addr		peer device's BLE mac address
 *
 * @return					>=0: Success.
 *							<0:  Fail. The absolute value represents possible error
 *								 @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_start(int conidx, uint8_t bd_addr[BLE_BDADDR_LEN]);

void main_task(void *h_bstk)
{
	int res;

	while (1) {
		osEvent evt;

		evt = osMessageGet(g_app_msg_q_id, osWaitForever);
		if (evt.status == osEventMessage)
		{
			msg_t *p_msg = (msg_t*)evt.value.p;

			PRINTD(DBG_TRACE, "==>%s\n", MSG_ID_STR[p_msg->msg_id]);

			switch (p_msg->msg_id)
			{
			case MSG_CON:
				g_conidx = *((int*)p_msg->msg);
				res = in_trx_clt_start(g_conidx, p_msg->msg+sizeof(int));
				break;

			...

			default:
				break;
			}
			free(p_msg);
		}
	}
}
```

The *MSG_CON* message is posed to main task when application receives BLE event *GAP_EVT_CONN_REQ* via registered callback function. Here is sample about how callback function is registered.

```c
int main(void)
{
    
    ...

	/**
	****************************************************************************************
	* @brief Set ble related callback
	* @note more information of this function can be found in ble_app_cbf_t
	*
	****************************************************************************************
	*/
	ble_app_cbf_t* cbf = ble_app_get_default_cb();
	cbf->gap.evt_disconnect = ble_disconnect;
	cbf->gap.evt_conn_ind = ble_connect;

    ...
}

/**
****************************************************************************************
* @brief callback for ble connection
* @param[out] req	request of ble connection.
* @param[out] cfm Connection request confirm structure.
* @note we can get information in ble_evt_conn_req_t and ble_conn_cfm_t
*
****************************************************************************************
*/
static void ble_connect(inb_evt_conn_req_t* req, inb_conn_cfm_t* cfm)
{
	uint8_t *addr = req->peer_addr.addr;
	PRINTD(DBG_TRACE, "ble_connect  Connect  0x%02x:0x%02x:0x%02x:0x%02x:0x%02x:0x%02x  conid:%d intv:0x%x lantency:0x%x timeout:0x%x clock:0x%x***\r\n",
		   addr[0], addr[1],addr[2],addr[3],addr[4],addr[5], req->conidx, req->con_interval, req->con_latency, req->sup_to, req->clk_accuracy);

	msg_t *p_msg = (msg_t*)malloc(sizeof(msg_t)+sizeof(int)+6);
	if (p_msg) {

		p_msg->msg_id = MSG_CON;
		p_msg->msg_len = 0;
		*((int*)p_msg->msg) = req->conidx;
		memcpy(p_msg->msg+sizeof(int), req->peer_addr.addr, 6);

		int res = osMessagePut(g_app_msg_q_id, (uint32_t)p_msg, 0) ;
		if (res) {
			PRINTD(DBG_TRACE, "put msg  err %X \r\n", res);
			free(p_msg);
		}
	}
}
```

After SDP procudure is end, <code>ready_callback</code> function that is passed when initialization is called to inform application whether success or not. Here is sample of ready callback function.

```c
static int trx_ready_cb(int conidx, int res)
{
	PRINTD(DBG_TRACE, "trx ready: 0x%x\r\n", res);

	g_trx_svc_ready = res;

	if ( g_conidx != -1 && g_trx_svc_ready == 0 && g_trx_ntf_en == false) {

		g_trx_ntf_en = true;
		res = in_trx_clt_enable_ntf(g_conidx, g_trx_ntf_en);
		PRINTD(DBG_TRACE, "trx notify %s\n", g_trx_ntf_en ? "enabled" : "disabled");
	}
}
```

It calls **in_trx_clt_enable_ntf** function to enable server to transmit data for both GATT notify and indicate. Till now, client is ready to exchange data with peer server. To transmit data call **in_trx_clt_send**, whose parameters are the same as those of the server function.

```c
/**
 ****************************************************************************************
 * @brief Trx Client sends data. If Service Discovery Procedure (SDP) is on-going, it is
 *		not allowed to send data.
 *
 * @param[in] conidx	connection index of peer
 * @param[in] p_data	notify data buffer
 * @param[in] data_len  notify data length
 * @param[in] ack		use GATT_WRITE_NO_RESPONSE write method if false
 *
 * @return					>=0: Success.
 *							<0:  Fail. The absolute value represents possible error
 *								 @see enum inb_error.
 ****************************************************************************************
 */
int in_trx_clt_send(int conidx, uint8_t *p_data, uint16_t data_len, bool ack);
```

Similar to server, when data is received, <code>rx_callback</code> function is called. Sample is same as that in server.

Here is Sequence Diagram to summarize the use of TRx profile.

![Tranparent Data Transmission Sequence Diagram](/images/in_trx_sequence_diagram.png)


