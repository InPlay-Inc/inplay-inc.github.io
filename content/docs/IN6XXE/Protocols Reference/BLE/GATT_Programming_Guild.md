---
title: "GATT Programming Guide"
---

# GATT Programming Guide
---

## Overview

The GATT (Generic Attribute) is a standard profile in BLE protocol which defines a framework of services and characteristics using ATT attributes as building blocks. The ATT protocol defineds a flat set of data structure called attributes, while GATT defines a hierarchy so that the attributes are grouped into primary and secondary services and these services can include characteristics. GATT also defines how a device will discover, read, write, notify, and indicate the characteristics based on ATT attribute access method. The position of GATT in BLE protocol stack is shown in Figure 1.

![Figure](/images/GATT_in_LE_protocol_stack.png "Figure 1: GATT in LE protocol stack")

Inplay provides the following GATT programming APIs. In this ducument, some major APIs will be introduced and the rest please refer to prototype description in *inc/ble/in_ble_gatt.h* for detail.

```c 
int in_ble_gatt_exc_mtu(void *hdl, int conidx, uint16_t *p_mtu, comp_cb callback);
int in_ble_gatt_sdp(void *hdl, int conidx, int sdp_type, ble_gatt_sdp_t *p_sdp, comp_cb callback);
int in_ble_gatt_discovery(void *hdl, int conidx, int disc_type, ble_gatt_disc_t *p_disc, comp_cb callback);
int in_ble_gatt_read(void *hdl, int conidx, int read_type, ble_gatt_read_req_t *p_req, comp_cb callback);
int in_ble_gatt_write(void *hdl, int conidx, int wrt_type, ble_gatt_write_t *p_write, comp_cb callback);
int in_ble_gatt_excute_write(void *hdl, int conidx, bool execute, comp_cb callback);
int in_ble_gatt_register_ind_ntf_event(void *hdl, int conidx, bool reg, uint32_t start_hdl, uint32_t end_hdl, comp_cb callback);
int in_ble_gatt_indication_cfm(void *hdl, int conidx, uint16_t handle);
int in_ble_gatt_send_ind(void *hdl, int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);
int in_ble_gatt_send_ntf(void *hdl, int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);
int in_ble_gatt_send_ntf_direct(void *hdl, int conidx, uint32_t handle, uint32_t length, uint8_t *value);
int in_ble_gatt_send_svc_changed(void *hdl, int conidx, uint32_t svc_shdl, uint32_t svc_ehdl, comp_cb callback);
int in_ble_gatt_add_svc(void *hdl, ble_gatt_svc_desc_t *p_svc, uint16_t *p_hdl, comp_cb callback);
int in_ble_gatt_get_svc_perm(void *hdl, uint16_t start_hdl, uint8_t *p_perm, comp_cb callback);
int in_ble_gatt_set_svc_perm(void *hdl, uint16_t start_hdl, uint8_t perm, comp_cb callback);
int in_ble_gatt_get_att_perm(void *hdl, uint16_t handle, ble_att_perm_t *p_perm, comp_cb callback);
int in_ble_gatt_set_att_perm(void *hdl, uint16_t handle, uint16_t perm, uint16_t ext_perm, comp_cb callback);
int in_ble_gatt_get_att_value(void *hdl, uint16_t handle, ble_att_val_t *p_att_val, comp_cb callback);
int in_ble_gatt_set_att_value(void *hdl, uint16_t handle, uint16_t length, uint8_t *value, comp_cb callback);
int in_ble_gatt_att_info_req_cfm(void *hdl, int conidx, uint16_t handle, uint16_t length, uint8_t status);
int in_ble_gatt_write_req_cfm(void *hdl, uint8_t conidx, uint16_t handle, uint8_t status);
int in_ble_gatt_read_req_cfm(void *hdl, uint8_t conidx, uint16_t handle, uint8_t status, uint16_t length, uint8_t *value);
```

You can see almost all APIs above have one common parameter <code>callback</code> which is of below type. If it is NULL, API call will be blocked until BLE protocol stack finishes processing the request. Otherwise, API will return immediately and the designated callback function will be called asynchronously when BLE protocol stack finishes processing the request. Application can utilize this time to perform their own tasks in parallel.

Other APIs that do not have <code>callback</code> parameter just provide information to protocol stack and thus return immediately.

```c
typedef void (*comp_cb)(int conidx, int status, void *p_para);
```

Similar to ATT, GATT defines below two roles. A device may act as a server, a client, or both.

1. ***Client:*** The client initiates transactions to the server and can receive responses from the server. This includes commands and requests sent to the server and responses, indications and notifications received from the server.

2. ***Server:*** The server receives the commands and requests from the client and sends responses, indications and notifications to the Client.

From application's point of view, usually a device that is the data producer such as sensor nodes, implements the server role with services and characteristics needed to fulfill the application requirements. A device that is data consumer such as mobile phone or gateway, acts as a client. 

Inplay Transparent Data Transmission (TRx) profile under *proj/common/util/in_trx_svc.c* and *proj/common/util/in_trx_clt.c* in SDK is a common profile developed based on GATT. Take it as an example to see the basic usage of these GATT APIs.

## Server

Like said above, GATT server provides one or more services and characteristics included within services to fulfill application requirements. So the first step application needs to do is to create services.

### Create Service

The function that creates GATT service is <code>in_ble_gatt_add_svc</code>, whose prototype is as follows:

```c
/**
 ****************************************************************************************
 * @brief Add a new Service  
 * @note This can only issue by the Server.
 *
 * @param[in] p_svc					Pointer to service data structure  
 * @param[out] p_hdl				Service handle
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_add_svc(void *hdl, ble_gatt_svc_desc_t *p_svc, uint16_t *p_hdl, comp_cb callback);
```

- <code>p_svc</code> is a pointer to <code>ble_gatt_svc_desc_t</code> in which service information is provided as well as all the attributes the service includes.

```c
/// Attribute Description
typedef struct 
{
    /// Attribute UUID (LSB First) 
    uint8_t uuid[BLE_UUID_128_LEN];

     /// Attribute Properties, @see enum ble_att_char_prop and @see enum ble_att_perm_prop
    uint16_t prop;

    /// Maximum length of the attribute
    ///
    /// Note:
    /// For Included Services and Characteristic Declarations, this field contains targeted
    /// handle.
    ///
    /// For Characteristic Extended Properties, this field contains 2 byte value
    /// 
    /// Not used Client Characteristic Configuration and Server Characteristic Configuration,
    /// this field is not used.
    ///
    uint16_t max_len;

	/// Attribute extended properties, @see enum ble_att_ext_prop 
    uint16_t ext_prop;
} ble_gatt_att_desc_t;

/// Service description
typedef struct 
{
    /// Attribute Start Handle (0 = dynamically allocated)
    uint16_t start_hdl;

	/// Service properties, @see ble_att_svc_prop
    uint8_t prop;

    /// Service  UUID 
    uint8_t uuid[BLE_UUID_128_LEN];

    /// Number of attributes
    uint8_t nb_att;

     /// List of attribute description present in service.
    ble_gatt_att_desc_t atts[];

} ble_gatt_svc_desc_t;
```

In TRx profile, there is only one service which contains two majoy characteristics representing data tx ([TRX_CHAR_VAL_TX]) and rx ([TRX_CHAR_VAL_RX]) respectively. Their <code>uuid</code> are application defined. According to the GATT standard, each service must first contain an attribute called Characteristic Declaration with a fixed <code>uuid</code> 0x2803. In addition, the server usually allows the client to control whether the server is able to send data by notification or indicatation method or not. Therefore, for the characteristic of data rx, a Client Characteristic Configuration Descriptor with predefined <code>uuid</code> 0x2902 should be added in the service. 

The <code>prop</code> defines the access method of the attribute, **ATT_CHAR_PROP_READ**, **ATT_CHAR_PROP_WRITE**, **ATT_CHAR_PROP_NOTIFY**, **ATT_CHAR_PROP_INDICATE** etc, which is clear in meaning by its name. For example, **ATT_CHAR_PROP_NOTIFY** should be specified for attribute [TRX_CHAR_VAL_TX] which represents the data tx, because TRX_CHAR_VAL_TX depends on the method of Notify. For attribute [TRX_CHAR_VAL_RX] representing the data rx, **ATT_CHAR_PROP_WRITE** should be specified, which means that the client sends data to the server through the method of GATT Write. 

The <code>ext_prop</code> defines some extended attributes. Commonly used bits include **ATT_EXT_PROP_UUID_LEN** and **ATT_EXT_PROP_RI**. **ATT_EXT_PROP_UUID_LEN** defaults to 00, which means that the UUID is 16Bytes instead of 2Bytes (like UUIDs predefined by SIG). It should be noted that if the prop of the attribute [TRX_CHAR_VAL_TX] is readable, the bit ATT_EXT_PROP_RI must be set in this field.

```c
static const ble_gatt_att_desc_t trx_atts[] = {
	[TRX_DECL_CHAR_RX] = {
		.uuid = { 0x03, 0x28 },
		.prop = ATT_CHAR_PROP_READ,
		.max_len = 0,
		.ext_prop = (0 << ATT_EXT_PROP_UUID_LEN_SHIFT),
	},
	[TRX_CHAR_VAL_RX] = {
		.uuid = {TRX_RX_UUID },
		.prop = ATT_CHAR_PROP_WRITE|ATT_CHAR_PROP_WRITE_NO_RSP,
		.max_len = TRX_MAX_LEN,
		.ext_prop = (2 <<ATT_EXT_PROP_UUID_LEN_SHIFT),
	},
	[TRX_DECL_CHAR_TX] = {
		.uuid = { 0x03, 0x28 },
		.prop = ATT_CHAR_PROP_READ,
		.max_len = 0,
		.ext_prop =  (0 << ATT_EXT_PROP_UUID_LEN_SHIFT),
	},
	[TRX_CHAR_VAL_TX] = {
		.uuid = {TRX_TX_UUID},
		.prop = ATT_CHAR_PROP_NOTIFY | ATT_CHAR_PROP_INDICATE,
		.max_len = TRX_MAX_LEN,
		.ext_prop =  (2 << ATT_EXT_PROP_UUID_LEN_SHIFT),
	},
	[TRX_CLIENT_CHAR_CFG_TX] = {
		.uuid = { 0x02, 0x29 }, //INB_ATT_DESC_SERVER_CHAR_CFG,
		.prop = ATT_CHAR_PROP_READ|ATT_CHAR_PROP_WRITE,
		.max_len = 0,
		.ext_prop = 0,
	},
};
```

Now create service. <code>start_hdl</code> is set to 0 to allow GATT profile allocate space for service. If it is known for sure the service will not be conflict with other existing services, specific start_hdl can be assigned. <code>uuid</code> is application defined UUID of service. <code>prop</code> is service property. The API's return value will be start attribute handle of service that is allocated by protocol stack if successful.

```c
int nb_att = sizeof(trx_atts)/sizeof(trx_atts[0]);
inb_gatt_svc_desc_t *p_svc_desc = malloc(sizeof(inb_gatt_svc_desc_t)  + nb_att * sizeof(inb_gatt_att_desc_t));

p_svc_desc->start_hdl = 0;	
p_svc_desc->prop = (2 << ATT_SVC_PROP_UUID_LEN_SHIFT);		
memcpy(p_svc_desc->uuid, svc_uuid, 16);
p_svc_desc->nb_att = nb_att;
memcpy(p_svc_desc->atts, &trx_atts[0], nb_att * sizeof(inb_gatt_att_desc_t));

res = in_ble_gatt_add_svc(g_trx_svr.h_bstk, p_svc_desc, &hdl, NULL);
```

In short, the main concern when creating a service is to define the structure of the Characteristic in the service and their accessing method.

### Server Sending Data

Below are APIs that server usually uses to send data, by GATT notify or indicate method.

```c
/**
 ****************************************************************************************
 * @brief Send indication 
 * @note This can only issue by the Server.
 *
 * @param[in] conidx				Connection index  
 * @param[in] handle				Inidcation attribute handle
 * @param[in] length				Inidcation attribute value length
 * @param[in] value					Inidcation attribute value
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_send_ind(void *hdl, int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);

/**
 ****************************************************************************************
 * @brief Send notification 
 * @note This can only issue by the Server.
 *
 * @param[in] conidx				Connection index  
 * @param[in] handle				Notification attribute handle
 * @param[in] length				Notification attribute value length
 * @param[in] value					Notification attribute value
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_send_ntf(void *hdl, int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);
```

As mentioned above, application defines service structure and the create API returns handler of first attribute within the service. Now handlers of all Characteristic are known. However, what concerns us more is [TRX_CHAR_VAL_RX] and [TRX_CHAR_VAL_TX]. More exactly, for the server, only the handle of [TRX_CHAR_VAL_TX] is needed.

```markdown
Handle of TX Characteristic = Start Handle + TRX_CHAR_VAL_TX + 1
```

The 1 in above formula actually represents the additional attribute "Service Declaration" in service, which is not described in service description structure when it is created but added automatically by GATT profile.

In sample TRx profile, it is call like below:

```c
res = in_ble_gatt_send_ntf(g_trx_svr.h_bstk, conidx, g_trx_svr.hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);

res = in_ble_gatt_send_ind(g_trx_svr.h_bstk, conidx, g_trx_svr.hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);
```

In above sample, <code>g_trx_svr.hdl_svc</code> holds the Start handle of service. The <code>conidx</code> parameter in the API represents a specific connection. After connecting with the other device, the protocol stack will return this value to identify the connection.

Data notification and Indication has differet operations, as refered to GATT protocol:

> <span style="color:grey;"><em>Server-initiated updates are the only asynchronous (i.e., not as a response to a client’s request) packets that can flow from the server to the client. These updates send timely alerts of changes in a characteristic value without the client having to regularly poll for them, saving both power and bandwidth. There are two types of server-initiated updates: </em></span>

> <span style="color:grey;"><em>Characteristic Value Notification</em></span>

> <span style="color:grey;"><em>Notifications are packets that include the handle of a characteristic value attribute along with its current value. The client receives them and can choose to act upon them, but it sends no acknowledgement back to the server to confirm reception. Along with write without response, this is the only other packet that does not comply with the standard request/response flow control mechanism in ATT, as the server can send any number of these notifications at any time. This feature uses the handle value notification (HVN) ATT packet.</em></span>

> <span style="color:grey;"><em>Characteristic Value Indication</em></span>

> <span style="color:grey;"><em>Indications, on the other hand, follow the same handle/value format but require an explicit acknowledgment from the client in the form of a confirmation. Note that although the server cannot send further indications (even for different character‐ istics) until it receives confirmation from the client (because this flows in the op‐ posite direction than the usual request/response pairs), an outstanding confirma‐ tion does not affect potential requests that the client might send in the meantime. This feature uses the handle value indication (HVI) and handle value confirma‐ tion (HVC) ATT packets.</em></span>

<code>in_ble_gatt_send_ntf</code> implements the above-mentioned function of Characteristic Value Notification. It is called by the server when needed (for example, when the sensor changes) instead of being polled by the client. After being called, it is cached in the ATT protocol stack, and then returns immediately whether the response from the peer ATT layer is received or not.

Accordingly, <code>in_ble_gatt_send_ind</code> implements the above-mentioned function of Characteristic Value Indication. The main difference is that each call needs to wait for the response of the peer ATT layer before it can be completed and exit.

For example, assume that the parameter of Bluetooth connection is 1s. Call in_ble_gatt_send_ntf or <code>in_ble_gatt_send_ind</code> twice during the period. The application osThread that calls in_ble_gatt_send_ntf can continue to work. At the same time, at the next connection point, the data sent by the two calls can be received by the other side simultaneously. If the connection is suddenly interrupted, the data sent is lost. The thread calling in_ble_gatt_send_ind will get blocked until the next connection point has sent data and received the other party's response successfully. It holds true for the next call. That is, for the same two packets, using <code>in_ble_gatt_send_ind</code> causes an interval of 2 seconds, but it will ensure that the sent data will not get lost.

### Server Receiving Data

When GATT profile receives data from peer connection device (client), it will post a **GATT_EVT_WRT_REQ** event to application since client send data via GATT write method. We will talk about it later on session of client send data. All server need to do is to register event callback when system is initialized by <code>in_ble_api_init</code>.

In sample TRx profile, <code>evt_wrt_req</code> is registered to handle this event when client writes to [TRX_CHAR_VAL_RX] and [TRX_CLIENT_CHAR_CFG_TX] characteristic, which both have ATT_CHAR_PROP_WRITE property when creating.

```c
static void evt_wrt_req(ble_evt_write_req_ind_t* ind, uint8_t* status)
{
	*status = IN_BLE_ATT_ERR_INVALID_HANDLE;
	uint16_t handle = ind->handle - g_trx_svr.hdl_svc - 1;
	int res = 0;

	switch (handle)
	{
	case TRX_CHAR_VAL_RX:
		{
			g_trx_svr.conidx = ind->conidx;
			if (g_trx_svr.rx_callback) {
				res = g_trx_svr.rx_callback(ind->conidx, ind->value, ind->length);
				if (res == 0) {
					*status = IN_BLE_ERR_NO_ERROR;
				} else {
					*status = IN_BLE_GATT_ERR_WRITE;
				}
			} else {
				*status = IN_BLE_ERR_NO_ERROR;
			}
		} break;
	case TRX_CLIENT_CHAR_CFG_TX:
		{
			g_trx_svr.conidx = ind->conidx;
			if (ind->length == 2) {
				g_trx_svr.cfg[ind->conidx] = *(uint16_t*)ind->value;
				*status = IN_BLE_ERR_NO_ERROR;

				if( g_trx_svr.tx_en_callback )
					g_trx_svr.tx_en_callback(ind->conidx, g_trx_svr.cfg[ind->conidx]);

			} else {
				*status = IN_BLE_GATT_ERR_WRITE;
			}
		} break;
	default:
		{
			//We'v done so let others handle it
			if (g_trx_svr.cbf.gatt.evt_wrt_req)
				g_trx_svr.cbf.gatt.evt_wrt_req(ind, status);
		}break;
	}
}
```

Note it's important to set <code>*status</code> to the right value so that ATT protocol will send right response to client.

### Server notification enable and disable

In TRx sample above, there is a configuration attribute [TRX_CLIENT_CHAR_CFG_TX] for data sending, with which the client can enable or disable the server to send data. For example, the sensor is not required to report data at some specific time. Obviously, this attribute is also writing for the client, so it is similar to the server's processing method of receiving data.

Enable or disable request is stored in variable <code>g_trx_svr.cfg</code>. When sending data, if it is disabled by client, data is not sent.

```c
int in_trx_notify(int conidx, uint8_t *buf, uint32_t len, bool ack)
{
	int res = 0;

	if (len > TRX_MAX_LEN) {
		res = IN_BLE_PLT_ERR_INVALID_PARAM;
		goto out;
	}

	if (g_trx_svr.cfg[conidx] & 0x1)
	{
		if (ack)
			res = in_ble_gatt_send_ind(g_trx_svr.h_bstk, conidx, g_trx_svr.hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);
		else
			res = in_ble_gatt_send_ntf(g_trx_svr.h_bstk, conidx, g_trx_svr.hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);

		if (res != IN_BLE_ERR_NO_ERROR) {
			PRINTD(DBG_ERR, "in_trx_notify: 0x%x\n", res);
		}
	}

out:
	return (0-res);
}
```

### Read request from client

Client can also directly poll data from server by ATT read method to characteristic that allow read access permission. In sample TRx service, we don’t grant [TRX_CHAR_VAL_TX] characteristic read access, which can only be notified and indicated. But [TRX_CLIENT_CHAR_CFG_TX] characteristic is readable so that client can know if server is allowed notification or not.

The sequence is when client send characteristic read request to server, ATT protocol stack sends *GATT_EVT_RD_REQ* event to inform application. Once the attribute handle is right, application provides actual data to ATT protocol stack so that it transmit back to client.

If *ble_app.c* is used, application is only required to register event callback for *GATT_EVT_RD_REQ* to provide data and <code>in_ble_gatt_read_req_cfm</code> is called by ble_app to send back to ATT protocol.

Here is what has been done in *ble_app.c* for the event.

```c
static void handle_default_gatt_evt(uint16_t eid, void* pv)
{
    switch (eid)
    {
	case GATT_EVT_RD_REQ:/// GATT read request indication  
		{

            ...

			if (status != IN_BLE_ERR_NO_ERROR) {
				if (p_app->evt_cbf->gatt.evt_rd_req) {
					p_app->evt_cbf->gatt.evt_rd_req(ind, &status, &data_len, &data); 
				} else {
					status = IN_BLE_ATT_ERR_REQUEST_NOT_SUPPORTED;
				}
			}
			in_ble_gatt_read_req_cfm(p_app->hdl_bs, ind->conidx, ind->handle, status, data_len, data);
		}
		break;
    }
}
```

Here is what TRx server has done in registered cabllback function. First handle is checked whether it is beyond the scope in service and *IN_BLE_ATT_ERR_INVALID_HANDLE* is returned otherwise. For [TRX_CLIENT_CHAR_CFG_TX] characteristic, the data to be read is enable/disable configurations which is 2 bytes length.

```c
static void evt_rd_req(ble_evt_read_req_ind_t* ind, uint8_t* status, uint16_t* rd_data_len, uint8_t** rd_data)
{
	*status = IN_BLE_ATT_ERR_INVALID_HANDLE;
	uint16_t handle = ind->handle - g_trx_svr.hdl_svc - 1;

	switch (handle)
	{
	case TRX_CLIENT_CHAR_CFG_TX:
		{
			g_trx_svr.conidx = ind->conidx;
			*rd_data_len = 2;
			*rd_data = (uint8_t*)&g_trx_svr.cfg;
			*status = IN_BLE_ERR_NO_ERROR;
		} break;
	}
}
```

## Client

On the other hand, the client has simpler work to do than server when initializing but more complicated after connection is established with server. Since all the APIs relies on attribute handle, unless service's start handle and its structure is well known in advance, such as both client and server use the sample TRx profile and the start handle of service is fixed, they are going to be obtained in the following procedure called Service Discovery Protocol (SDP). 

The client must know the corresponding handle of the attribute in service before any client operations. If both parties in the connection are devices developed by yourself, it means that you are already familiar with the structure of the service, UUID of the service and the starting handle, so this condition is naturally satisfied, and you only need to constantize it in the code. Otherwise, you will need to obtain it through the discover process.

### Discovering Service by <code>in_ble_gatt_sdp</code>

This function starts SDP in BLE stack and returns result through event. API prototype is as follows

```c
/**
 ****************************************************************************************
 * @brief Service Discovery Procedure
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] sdp_type				Service Discovery Type, @see enum ble_gatt_sdp_type
 * @param[in] p_sdp					Pointer to service discovery paramters
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_sdp(void *hdl, int conidx, int sdp_type, ble_gatt_sdp_t *p_sdp, comp_cb callback);
```

There are three value for <code>sdp_type</code>: GATT_SDP_DISC_SVC, GATT_SDP_DISC_SVC_ALL, GATT_SDP_DISC_SVC_ALL. Here in sample TRx profile, GATT_SDP_DISC_SVC is used, just as the name suggests, discover one certain service.

```c
static int discover_svc(trx_clt_t *p_trx_clt)
{
	int res=0;
	uint8_t sdp_buf[sizeof(ble_gatt_sdp_t)+BLE_UUID_128_LEN];

	//Discover now
	ble_gatt_sdp_t *p_sdp = (ble_gatt_sdp_t *)sdp_buf;
	p_sdp->start_hdl = 1;
	p_sdp->end_hdl = 0xFFFF;
	p_sdp->uuid_len = BLE_UUID_128_LEN;
	memcpy(p_sdp->uuid, g_trx_clt.svc_uuid, BLE_UUID_128_LEN);

	res = in_ble_gatt_sdp(g_trx_clt.h_bstk, p_trx_clt->peer_conidx, GATT_SDP_DISC_SVC, p_sdp, NULL);

	return res;
}
```

Not only UUID of the service but also handle range is necessary. The range can be specified as 1~0xFFFF, which means searching all attributes. If the service is not within this handle range, discover fails either. 

After service is discovered, **GATT_EVT_SDP_SVC** event is sent to application. Here in sample TRx profile, the event is retrieved by registered event handler <code>evt_sdp_svc</code> with ble_app component.

```c
static void evt_sdp_svc(ble_evt_sdp_svc_ind_t *p_ind)
{
	int res;

	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);
	if (p_trx_clt){
		PRINTD(DBG_TRACE, "Discover Service (%d, %d)\r\n", p_ind->start_hdl, p_ind->end_hdl);
		p_trx_clt->start_hdl = p_ind->start_hdl;
		p_trx_clt->end_hdl = p_ind->end_hdl;
		p_trx_clt->cfg = 0;

		//Means SDP procedure is over
		if (g_trx_clt.trx_clt_ready_cb)
			g_trx_clt.trx_clt_ready_cb(p_trx_clt->peer_conidx, 0);
	}

	//We'v done so let others handle it
	if (g_trx_clt.cbf.gatt.evt_sdp_svc)
		g_trx_clt.cbf.gatt.evt_sdp_svc(p_ind);
}

int in_trx_clt_init(in_trx_clt_t *p_in_trx_clt)
{

    ...

	//GATT event
	p_cbf->gatt.evt_sdp_svc = evt_sdp_svc;

	return 0;
}
```

The start and end attribute handle of service are retrieved, which are the key to client. Now the client is functionable.

### Discovering Service by <code>in_ble_gatt_discovery</code>

<code>in_ble_gatt_sdp</code> is not the only API but maybe the simplest one. There is another option as following prototype which can do more.

```c
/**
 ****************************************************************************************
 * @brief Attributes Discovery
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] disc_type			Attribute discovery type, @see enum ble_gatt_disc_type
 * @param[in] p_disc					Pointer to attribute discovery paramters
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_discovery(void *hdl, int conidx, int disc_type, ble_gatt_disc_t *p_disc, comp_cb callback);
```

This function is to discovery not only service but single characteristic. In the sample, if we use this function to do service discovery, <code>disc_type</code> should be set to GATT_DISC_BY_UUID_SVC. Other parameters are similar to <code>in_ble_gatt_sdp</code>.

After service is discovered, a different **GATT_EVT_DISC_SVC** event is sent to application. Register this event handler is a MUST when using this option. The event handler looks like quite similar to event handler of **GATT_EVT_SDP_SVC**, and the key information are .

```c
void (*evt_disc_svc)(ble_evt_disc_svc_ind_t *);

/// Discover Service indication Structure
typedef struct 
{
	/// Connection index
	uint8_t conidx;
    /// start handle
    uint16_t start_hdl;
    /// end handle
    uint16_t end_hdl;
    /// UUID length
    uint8_t  uuid_len;
    /// service UUID
    uint8_t  uuid[];
} ble_evt_disc_svc_ind_t;
```

### Client Sending Data

Usually the way that client sends data to server is via GATT write method. API prototype is as follows:

```c
/**
 ****************************************************************************************
 * @brief Write Attribute 
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] wrt_type				Attribute write type, @see enum ble_gatt_write_type
 * @param[in] p_write				Pointer to attribute write paramters
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_write(void *hdl, int conidx, int wrt_type, ble_gatt_write_t *p_write, comp_cb callback);
```

The most importand parameter is <code>wrt_type</code>, which corresponds to various write methods in the GATT protocol: GATT_WRITE, GATT_WRITE_NO_RESPONSE, GATT_WRITE_SIGNED, GATT_EXEC_WRITE. Here in the sample the GATT_WRITE or GATT_WRITE_NO_RESPONSE type is used depending on if ack is needed.

First, the Characteristic in service must have write permissions. Reviewing the previous sample TRX service definition, characteristics [TRX_CHAR_VAL_RX] and [TRX_CLIENT_CHAR_CFG_TX] have <code>ATT_CHAR_PROP_WRITE</code> permission. The previous attribute corresponds to the direction of the data flow, which is from the client to the server, while the latter is used for the client to control the enabling of data transmission from the server. 

With the start handle of the service that discovered, the client can use the <code>in_ble_gatt_write</code> method to send data to the server.

The <code>p_write</code> structure contains the parameters of the Write methods, as well as common parameters such as handle, offset and length. Note that for the GATT_WRITE type, the value of the 'auto_execute' parameter is true.

Here is what sample TRX client has done:

```c
int in_trx_clt_send(int conidx, uint8_t *p_data, uint16_t data_len, bool ack)
{
	int res = 0;
	ble_gatt_write_t *p_write=NULL;
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(conidx);

	if ( !p_trx_clt || p_trx_clt->peer_conidx == -1 || trx_clt_is_undisced(p_trx_clt)) {
		res = IN_BLE_PLT_ERR_NOT_READY;
		goto out;
	}

	p_write = (ble_gatt_write_t*)malloc(sizeof(ble_gatt_write_t)+data_len);
	if (p_write) {
		p_write->handle = p_trx_clt->start_hdl+TRX_CHAR_VAL_RX+1;
		p_write->auto_execute = true;
		p_write->offset = 0;
		p_write->length = data_len;
		memcpy(p_write->value, p_data, data_len);

		res = in_ble_gatt_write(g_trx_clt.h_bstk, p_trx_clt->peer_conidx, ack ? GATT_WRITE : GATT_WRITE_NO_RESPONSE , p_write, NULL);

		free(p_write);
	}

out:
	return 0-res;
}

static int enable_ntf(trx_clt_t *p_trx_clt, uint16_t enable)
{
	uint8_t buf[sizeof(ble_gatt_write_t)+2];
	int res = -1;
	ble_gatt_write_t *p_write=(ble_gatt_write_t *)buf;

	p_write->handle = p_trx_clt->start_hdl+TRX_CLIENT_CHAR_CFG_TX+1;
	p_write->auto_execute = true;
	p_write->offset = 0;
	p_write->length = 2;
	memcpy(p_write->value, &enable, p_write->length);

	res = in_ble_gatt_write(g_trx_clt.h_bstk, p_trx_clt->peer_conidx, GATT_WRITE, p_write, NULL);

	return res;
}
```

### Client Receiving Data

Similar to server receiving data, when GATT profile receives data notification from peer connection device (server), it will post **GATT_EVT_NTF** or **GATT_EVT_IND** event to application. Client resiter event callback when system initialization.

```c
static void evt_peer_evt_ntf(ble_evt_ntf_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);

	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false && p_ind->handle == p_trx_clt->start_hdl + TRX_CHAR_VAL_TX + 1)
	{
		if (g_trx_clt.trx_clt_rx_cb)
			g_trx_clt.trx_clt_rx_cb(p_ind->conidx, p_ind->value, p_ind->length);
	}

	//We'v done so let others handle it
	if (g_trx_clt.cbf.gatt.evt_peer_evt_ntf)
		g_trx_clt.cbf.gatt.evt_peer_evt_ntf(p_ind);
}

static void evt_peer_evt_ind(ble_evt_ind_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);

	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false && p_ind->handle == p_trx_clt->start_hdl + TRX_CHAR_VAL_TX + 1)
	{
		in_ble_gatt_indication_cfm( g_trx_clt.h_bstk, p_ind->conidx, p_ind->handle);

		if (g_trx_clt.trx_clt_rx_cb)
			g_trx_clt.trx_clt_rx_cb(p_ind->conidx, p_ind->value, p_ind->length);
	}

	//We'v done so let others handle it
	if (g_trx_clt.cbf.gatt.evt_peer_evt_ind)
		g_trx_clt.cbf.gatt.evt_peer_evt_ind(p_ind);
}
```

The difference between **GATT_EVT_NTF** and **GATT_EVT_IND** is an additional <code>in_ble_gatt_indication_cfm</code> function must be called so that ATT protocol will send response to peer ATT protocol layer. That's why indication is more reliable data transmission of GATT.

### Read data

Client can also directly poll data from server by ATT read method to characteristic that allows read access permission. In sample TRx service, [TRX_CLIENT_CHAR_CFG_TX] characteristic is readable so that client can know if server is already allowed notification or not.

```c
/**
 ****************************************************************************************
 * @brief Read Attribute 
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] read_type			Attribute read type, @see enum ble_gatt_read_type
 * @param[in] p_req				Pointer to attribute read paramters
 *
 * @return IN_BLE_ERR_NO_ERROR if successful, otherwise failed. @see enum in_ble_error 
 ****************************************************************************************
 */
int in_ble_gatt_read(void *hdl, int conidx, int read_type, ble_gatt_read_req_t *p_req, comp_cb callback);
```

The actual read result and value are retrieved by *GATT_EVT_RD_RSP_IND*. If *ble_app.c* is used, client must register event handler for the event. The register method is same as other callback function. Here is sample of callback function and actual read data is within <code>inb_evt_read_rsp_ind_t</code> parameter.

```c
void evt_read_rsp_ind(ble_evt_read_rsp_ind_t *p_ind)
{
    ...
}
```

