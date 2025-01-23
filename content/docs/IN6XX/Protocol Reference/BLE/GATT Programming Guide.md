---
title: "GATT Programming Guide"
---

# GATT Programming Guide
---

## Overview

GATT is a standard BLE protocol, which is based on the ATT protocol. The ATT protocol describes the structure and the access method of Attribute, the basic data unit of BLE. ATT is equivalent to a base class, while Generic Attribute Profile (GATT) is a derived class. It reorganizes attributes and constructs the structure of data access in the application layer - Service/Characteristic. It defines the methods and mechanisms of the data structures including Discover, Read, Write, and Notify/Indicate.

GATT is one of the protocols that BLE must support. Inplay provides the following GATT interface APIs.

```c 
int inb_gatt_exc_mtu(int conidx, uint16_t *p_mtu, comp_cb callback);
int inb_gatt_sdp(int conidx, int sdp_type, inb_gatt_sdp_t *p_sdp, comp_cb callback);
int inb_gatt_discovery(int conidx, int disc_type, inb_gatt_disc_t *p_disc, comp_cb callback);
int inb_gatt_read(int conidx, int read_type, inb_gatt_read_req_t *p_req, comp_cb callback);
int inb_gatt_write(int conidx, int wrt_type, inb_gatt_write_t *p_write, comp_cb callback);
int inb_gatt_excute_write(int conidx, bool execute, comp_cb callback);
int inb_gatt_register_ind_ntf_event(int conidx, bool reg, uint32_t start_hdl, uint32_t end_hdl, comp_cb callback);
int inb_gatt_indication_cfm(int conidx, uint16_t handle);
int inb_gatt_send_ind(int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);
int inb_gatt_send_ntf(int conidx, uint32_t handle, uint32_t length, uint8_t *value, comp_cb callback);
int inb_gatt_send_svc_changed(int conidx, uint32_t svc_shdl, uint32_t svc_ehdl, comp_cb callback);
int inb_gatt_add_svc(inb_gatt_svc_desc_t *p_svc, uint16_t *p_hdl, comp_cb callback);
int inb_gatt_get_svc_perm(uint16_t start_hdl, uint8_t *p_perm, comp_cb callback);
int inb_gatt_set_svc_perm(uint16_t start_hdl, uint8_t perm, comp_cb callback);
int inb_gatt_get_att_perm(uint16_t handle, inb_att_perm_t *p_perm, comp_cb callback);
int inb_gatt_set_att_perm(uint16_t handle, uint16_t perm, uint16_t ext_perm, comp_cb callback);
int inb_gatt_get_att_value(uint16_t handle, inb_att_val_t *p_att_val, comp_cb callback);
int inb_gatt_set_att_value(uint16_t handle, uint16_t length, uint8_t *value, comp_cb callback);
int inb_gatt_att_info_req_cfm(int conidx, uint16_t handle, uint16_t length, uint8_t status);
int inb_gatt_write_req_cfm(uint8_t conidx, uint16_t handle, uint8_t status);
int inb_gatt_read_req_cfm(uint8_t conidx, uint16_t handle, uint8_t status, uint16_t length, uint8_t *value);
```

Firstly, APIs in SDK can be synchronous or asynchronous calls. That's why almost all APIs above have one common parameter named "callback". If "callback" is NULL, the API will not return until BLE protocol stack has finished processing the request, send the data to or get the response from peer device. Otherwise, it will return immediately only indicating whether the request is acceptable or not. After the request has been processed or executed, the callback will be called then. Since processing the request takes time, the application can utilize this time to perform their own tasks in parallel.

Similar to ATT, GATT defines two roles, Server and Client. Server is the one who provides data service and the Client consumes data by read, write, indication or notification methods provided by server. Generally, peripherals who produce data (such as sensor nodes) act as server which creates services, while central devices obtain services and use them (such as sensor values notification). The transparent data transmission service of Inplay is also designed based on this principle.

Inplay Transparent Data Transmission service (proj/common/util/in_trx_svc.c and proj/common/util/in_trx_client.c in SDK) is a common component developed based on GATT. Take it as an example to see the basic usage of these APIs.

## GATT Server

### Create Service

The function that creates GATT service is <code>inb_gatt_add_svc</code>, whose prototype is as follows:

```c
/**
 ****************************************************************************************
 * @brief Add a new Service  
 * @note This can only issue by the Server.
 *
 * @param[in] p_svc					Pointer to service data structure  
 * @param[out] p_hdl				Service handle
 *
 * @return INB_ERR_NO_ERROR if successful, otherwise failed. @see enum inb_err_t 
 ****************************************************************************************
 */
int inb_gatt_add_svc(inb_gatt_svc_desc_t *p_svc, uint16_t *p_hdl, comp_cb callback);
```

- <code>p_svc</code> is a pointer to <code>inb_gatt_svc_desc_t</code> that contains all the attributes the service contains

```c
typedef struct 
{
    /// Attribute Start Handle (0 = dynamically allocated)
    uint16_t start_hdl;

	/// Service properties, @see inb_att_svc_prop
    uint8_t prop;

    /// Service  UUID 
    uint8_t uuid[INB_UUID_128_LEN];

    /// Number of attributes
    uint8_t nb_att;

     /// List of attribute description present in service.
    inb_gatt_att_desc_t atts[];

} inb_gatt_svc_desc_t;
```

The members of the structure are assigned as described in the comments. Here in the sample they are:

```c
static const inb_gatt_att_desc_t trx_atts[] = {
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

int nb_att = sizeof(trx_atts)/sizeof(trx_atts[0]);
inb_gatt_svc_desc_t *p_svc_desc = malloc(sizeof(inb_gatt_svc_desc_t)  + nb_att * sizeof(inb_gatt_att_desc_t));

p_svc_desc->start_hdl = 0;	
p_svc_desc->prop = (2 << ATT_SVC_PROP_UUID_LEN_SHIFT);		
memcpy(p_svc_desc->uuid, svc_uuid, 16);
p_svc_desc->nb_att = nb_att;
memcpy(p_svc_desc->atts, &trx_atts[0], nb_att * sizeof(inb_gatt_att_desc_t));
```

As shown above, the Inplay Transparent Data Transmission service contains two main characteristics, representing data input and output respectively. According to the GATT standard, each characteristic must first contain an attribute called Characteristic Declaration with a fixed UUID of 0x2803. In addition, the client can control whether the server can send data by notification or indicatation method. Therefore, for the characteristic of data output, a client characteristic configuration descriptor with a predefined UUID of 0x2902 should be added for the client to enable or disable the server data output.

The member <code>prop</code> defines the access method of the attribute, **ATT_CHAR_PROP_READ**, **ATT_CHAR_PROP_WRITE**, **ATT_CHAR_PROP_NOTIFY**, **ATT_CHAR_PROP_INDICATE** etc, which is clear in meaning by its name. For example, **ATT_CHAR_PROP_NOTIFY** should be specified for TRX_CHAR_VAL_TX which represents the data output, because TRX_CHAR_VAL_TX depends on the method of Notify. For TRX_CHAR_VAL_RX representing the data input, **ATT_CHAR_PROP_WRITE** should be specified, which means that the client sends data to the server through the method of GATT Write.

The member <code>ext_prop</code> defines some extended attributes. The definitions are shown as follows:

```c
/**
 * Extended properties bit field
 *
 * Bit [0-11] : Maximum Attribute Length or Value Offset pointer
 * Bit [12]   : Encryption key Size must be 16 bytes
 * Bit [14-13]: UUID Length             (0 = 16 bits, 1 = 32 bits, 2 = 128 bits, 3 = RFU)
 * Bit [15]   : Trigger Read Indication (0 = Value present in Database, 1 = Value not present in Database)
 */
enum inb_att_ext_prop
{
	/// Maximum Attribute Length
	ATT_EXT_PROP_MAX_LEN     = 0x0FFF,
	ATT_EXT_PROP_MAX_LEN_SHIFT      = 0,
	/// Attribute value Offset
	ATT_EXT_PROP_VAL_OFFSET  = 0x0FFF,
	ATT_EXT_PROP_VAL_OFFSET_SHIFT   = 0,
	/// Check Encryption key size Mask
	ATT_EXT_PROP_EKS         = 0x1000,
	ATT_EXT_PROP_EKS_SHIFT          = 12,
	/// UUID Length
	ATT_EXT_PROP_UUID_LEN    = 0x6000,
	ATT_EXT_PROP_UUID_LEN_SHIFT     = 13,
	/// Read trigger Indication
	ATT_EXT_PROP_RI          = 0x8000,
	ATT_EXT_PROP_RI_SHIFT           = 15,
};
```

Commonly used bits include **ATT_EXT_PROP_UUID_LEN** and **ATT_EXT_PROP_RI**. **ATT_EXT_PROP_UUID_LEN** defaults to 00, which means that the UUID is 16Bytes instead of 2Bytes (like UUIDs reserved for SIG). It should be noted that if the prop of the attribute TRX_CHAR_VAL_TX is readable, the bit ATT_EXT_PROP_RI must be set in this field.

- </code>p_hdl</code> points to unsigned short to retrieve the start attribute handle within service. 

- <code>callback</code>: Same as decription above. 

In short, the main concern when creating a service is to define the structure of the Characteristic in the service and their accessing method, which will be passed to API <code>inb_gatt_add_svc</code>.

### Server Sending Data

As mentioned above, application defines service structure and the create API returns handler of first attribute within the service. Now handlers of all Characteristic are known. However, what concerns us more is TRX_CHAR_VAL_RX and TRX_CHAR_VAL_TX. More exactly, for the server, only the handle of TRX_CHAR_VAL_TX is needed.

```markdown
Handle of TX Characteristic = Start Handle + TRX_CHAR_VAL_TX + 1
```

The 1 in above formula actually represents the additional attribute "Service Declaration" in service.

With this handler, server can notify or indicate data to client by:

```c
res = inb_gatt_send_ntf(conidx, p_svr->hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);

res = inb_gatt_send_ind(conidx, p_svr->hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);
```

In above sample, <code>p_srv->hdl_svc</code> holds the Start handle of service. The first parameter in the API represents a specific connection. After connecting with the other device, the protocol stack will return this value to identify the connection. 

Data notification and Indication has differet operations, as refered to GATT protocol:

> <span style="color:grey;"><em>Server-initiated updates are the only asynchronous (i.e., not as a response to a client’s request) packets that can flow from the server to the client. These updates send timely alerts of changes in a characteristic value without the client having to regularly poll for them, saving both power and bandwidth. There are two types of server-initiated updates: </em></span>

> <span style="color:grey;"><em>Characteristic Value Notification</em></span>

> <span style="color:grey;"><em>Notifications are packets that include the handle of a characteristic value attribute along with its current value. The client receives them and can choose to act upon them, but it sends no acknowledgement back to the server to confirm reception. Along with write without response, this is the only other packet that does not comply with the standard request/response flow control mechanism in ATT, as the server can send any number of these notifications at any time. This feature uses the handle value notification (HVN) ATT packet.</em></span>

> <span style="color:grey;"><em>Characteristic Value Indication</em></span>

> <span style="color:grey;"><em>Indications, on the other hand, follow the same handle/value format but require an explicit acknowledgment from the client in the form of a confirmation. Note that although the server cannot send further indications (even for different character‐ istics) until it receives confirmation from the client (because this flows in the op‐ posite direction than the usual request/response pairs), an outstanding confirma‐ tion does not affect potential requests that the client might send in the meantime. This feature uses the handle value indication (HVI) and handle value confirma‐ tion (HVC) ATT packets.</em></span>

<code>inb_gatt_send_ntf</code> implements the above-mentioned function of Characteristic Value Notification. It is called by the server when needed (for example, when the sensor changes) instead of being polled by the client. After being called, it is cached in the ATT protocol stack, and then returns immediately whether the response from the peer ATT layer is received or not.

Accordingly, <code>inb_gatt_send_ind</code> implements the above-mentioned function of Characteristic Value Indication. The main difference is that each call needs to wait for the response of the peer ATT layer before it can be completed and exit.

For example, assume that the parameter of Bluetooth connection is 1s. Call inb_gatt_send_ntf or <code>inb_gatt_send_ind</code> twice during the period. The application osThread that calls inb_gatt_send_ntf can continue to work. At the same time, at the next connection point, the data sent by the two calls can be received by the other side simultaneously. If the connection is suddenly interrupted, the data sent is lost. The thread calling inb_ gatt_ send_ind will get blocked until the next connection point has sent data and received the other party's response successfully. It holds true for the next call. That is, for the same two packets, using <code>inb_gatt_send_ind</code> causes an interval of 2 seconds, but it will ensure that the sent data will not get lost.

### Server Receiving Data

The client sends data by writing TRX_CHAR_VAL_RX characteristic, and the server needs to process **GATT_EVT_WRT_REQ** messages as follows. In the sample, <code>evt_wrt_req</code> is registered to ble_app component to handle this event.

```c
static void evt_wrt_req(inb_evt_write_req_ind_t* ind, uint8_t* status)
{
    *status = INB_ATT_ERR_INVALID_HANDLE;
    trx_svr_t *p_svr = &trx_svr;
    uint16_t handle = ind->handle - p_svr->hdl_svc - 1;
    int res = 0;

    switch (handle) {
    case TRX_CHAR_VAL_RX: {
        p_svr->conid = ind->conidx;
        if (p_svr->rx_callback) {
            res = p_svr->rx_callback(ind->conidx, ind->value, ind->length);
            if (res == 0) {
                *status = INB_ERR_NO_ERROR;
            } else {
                *status = INB_GATT_ERR_WRITE;
            }
        } else {
            *status = INB_ERR_NO_ERROR;
        }
    } break;
    case TRX_CLIENT_CHAR_CFG_TX: {

    ...

    } break;
    }
}

void in_trx_svc_cbf(ble_app_cbf_t *p_cbf)
{
	trx_svr_t *p_svr = &trx_svr;

	//GATT event
	p_svr->cbf.gatt.evt_wrt_req = p_cbf->gatt.evt_wrt_req;

	p_cbf->gatt.evt_wrt_req = evt_wrt_req;
	p_cbf->gatt.evt_rd_req = evt_rd_req;
}
```

Note it's important to set <code>*status</code> to the right value so that ATT protocol will send response to client.


### Server notification enable and disable

There is a configuration attribute (TRX_CLIENT_CHAR_CFG_TX) for data sending, with which the client can enable or disable the server to send data. For example, the sensor is not required to report data at some specific time. Obviously, this attribute is also writing for the client, so it is similar to the server's processing method of receiving data.

```c
static void evt_wrt_req(inb_evt_write_req_ind_t* ind, uint8_t* status)
{
    *status = INB_ATT_ERR_INVALID_HANDLE;
    trx_svr_t *p_svr = &trx_svr;
    uint16_t handle = ind->handle - p_svr->hdl_svc - 1;
    int res = 0;

    switch (handle) {
    case TRX_CHAR_VAL_RX: {

        ...

    } break;  
    case TRX_CLIENT_CHAR_CFG_TX: {
        p_svr->conid = ind->conidx;
        if (ind->length == 2) {
			p_svr->cfg[ind->conidx] = *(uint16_t*)ind->value;
            *status = INB_ERR_NO_ERROR;
        } else {
            *status = INB_GATT_ERR_WRITE;
        }
    }
    break;
    }
}
```

Enable or disable request is stored in variable <code>p_srv->cfg</code>. When sending data, if it is disabled by client, data is not sent.

```c
int in_trx_notify(int conidx, uint8_t *buf, uint32_t len, bool ack)
{
    if (len > TRX_MAX_LEN) {
        return INB_PLT_ERR_INVALID_PARAM;
    }
    int res = INB_ATT_ERR_APP_ERROR;
    trx_svr_t *p_svr = &trx_svr;
    if (p_svr->cfg[conidx] & 0x1)
	{
		if (ack)
			res = inb_gatt_send_ind(conidx, p_svr->hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);
		else
			res = inb_gatt_send_ntf(conidx, p_svr->hdl_svc + TRX_CHAR_VAL_TX + 1, len, (uint8_t *)buf, NULL);

		if (res != INB_ERR_NO_ERROR) {
			PRINTD(DBG_ERR, "in_trx_notify: 0x%x\n", res);
		}
    } 
    return res;
}
```

## GATT Client

The client must know the corresponding handle of the attribute in service before any client operations. If both parties in the connection are devices developed by yourself, it means that you are already familiar with the structure of the service, UUID of the service and the starting handle, so this condition is naturally satisfied, and you only need to constantize it in the code. Otherwise, you will need to obtain it through the discover process.

### Discovering Service by <code>inb_gatt_sdp</code>

This function starts sdp (Service Discover Procedure) in BLE stack and returns result through event. API prototype is as follows

```c
/**
 ****************************************************************************************
 * @brief Service Discovery Procedure
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] sdp_type				Service Discovery Type, @see enum inb_gatt_sdp_type
 * @param[in] p_sdp					Pointer to service discovery paramters
 *
 * @return INB_ERR_NO_ERROR if successful, otherwise failed. @see enum inb_err_t 
 ****************************************************************************************
 */
int inb_gatt_sdp(int conidx, int sdp_type, inb_gatt_sdp_t *p_sdp, comp_cb callback);
```

There are three value for <code>sdp_type</code>: GATT_SDP_DISC_SVC, GATT_SDP_DISC_SVC_ALL, GATT_SDP_DISC_SVC_ALL. Here in the sample, we use GATT_SDP_DISC_SVC, just as the name suggests, discover one certain service.

```c
static int discover_svc(trx_clt_t *p_trx_clt)
{
	int ret=0;
	uint8_t sdp_buf[sizeof(inb_gatt_sdp_t)+INB_UUID_128_LEN];
	
	//Discover now
	inb_gatt_sdp_t *p_sdp = (inb_gatt_sdp_t *)sdp_buf;
	p_sdp->start_hdl = 1;
	p_sdp->end_hdl = 0xFFFF;
	p_sdp->uuid_len = INB_UUID_128_LEN;
	memcpy(p_sdp->uuid, trx_clt.svc_uuid, INB_UUID_128_LEN);
	
	ret = inb_gatt_sdp(p_trx_clt->peer_conidx, GATT_SDP_DISC_SVC, p_sdp, NULL);
	
	return ret;
}
```

Not only UUID of the service but also handle range is necessary. The range can be specified as 1~0xFFFF, which means searching all attributes. If the service is not within this handle range, discover fails either. 

After service is discovered, **GATT_EVT_SDP_SVC** event is sent to application. Here in the sample the event is retrieved by registered event handler <code>evt_sdp_svc</code> with ble_app component.

```c
static void evt_sdp_svc(inb_evt_sdp_svc_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);
	if (p_trx_clt){
		PRINTD(DBG_TRACE, "<%s><%s>: Discover Service (%d, %d)\r\n", MODULE_NAME, __func__, p_ind->start_hdl, p_ind->end_hdl);
		p_trx_clt->start_hdl = p_ind->start_hdl;
		p_trx_clt->end_hdl = p_ind->end_hdl;
		p_trx_clt->cfg = 1;

		enable_ntf(p_trx_clt);
	}

    ...

}

int in_trx_clt_add(ble_app_cbf_t *p_cbf, osMessageQId qid, uint8_t svc_uuid[INB_UUID_128_LEN], int (*rx_callback)(int, uint8_t*, int))
{

    ...

	//register GATT event handler
	p_cbf->gatt.evt_sdp_svc = evt_sdp_svc;

	return 0;
}
```

Finally, the start and end handle of service are retrieved and then <code>inb_gatt_sdp</code> returns.

### Discovering Service by <code>inb_gatt_discovery</code>

API prototype is as follows:

```c
/**
 ****************************************************************************************
 * @brief Attributes Discovery
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] disc_type			Attribute discovery type, @see enum inb_gatt_disc_type
 * @param[in] p_disc					Pointer to attribute discovery paramters
 *
 * @return INB_ERR_NO_ERROR if successful, otherwise failed. @see enum inb_err_t 
 ****************************************************************************************
 */
int inb_gatt_discovery(int conidx, int disc_type, inb_gatt_disc_t *p_disc, comp_cb callback);
```

This function provides another option to discovery not only service but single characteristic. In the sample, if we use this function to do service discovery, <code>disc_type</code> should be set to GATT_DISC_BY_UUID_SVC. Other parameters are similar to <code>inb_gatt_sdp</code>.

After service is discovered, **GATT_EVT_DISC_SVC** event is sent to application. Register another event handler to ble_app component to retrieve discovery result.

Finally, the start and end handle of service are retrieved and then <code>inb_gatt_discovery</code> returns.

### Client Sending Data

The only way that client sends data to server is via GATT write method. API prototype is as follows:

```c
/**
 ****************************************************************************************
 * @brief Write Attribute 
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] wrt_type				Attribute write type, @see enum inb_gatt_write_type
 * @param[in] p_write				Pointer to attribute write paramters
 *
 * @return INB_ERR_NO_ERROR if successful, otherwise failed. @see enum inb_err_t 
 ****************************************************************************************
 */
int inb_gatt_write(int conidx, int wrt_type, inb_gatt_write_t *p_write, comp_cb callback);
```

The most critical parameter is <code>wrt_type</code>, which corresponds to various write methods in the GATT protocol: GATT_WRITE, GATT_WRITE_NO_RESPONSE, GATT_WRITE_SIGNED, GATT_EXEC_WRITE. Here in the sample the GATT_WRITE or GATT_WRITE_NO_RESPONSE type is used depending on if ack is needed.

First, the Characteristic in service must have write permissions. Reviewing the previous sample service definition, characteristics TRX_CHAR_VAL_RX and TRX_CLIENT_CHAR_CFG_TX have <code>ATT_CHAR_PROP_WRITE</code> permission. The previous attribute corresponds to the direction of the data flow, which is from the client to the server, while the latter is used for the client to control the enabling of data transmission from the server. 

With the start handle of the service, the client can use the inb_gatt_write interface to send data to the server.

The p_write structure contains the parameters of the Write methods, as well as common parameters such as handle, offset and length. Note that for the GATT_WRITE type, the value of the auto_execute parameter is true.

```c
int in_trx_clt_send(int conidx, bool ack, uint8_t *p_data, uint16_t data_len)
{
	int ret = -1;
	inb_gatt_write_t *p_write=NULL;
	trx_clt_t *p_trx_clt;
	
	p_trx_clt = trx_clt_get_by_conidx(conidx);
	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false)
	{
		p_write = (inb_gatt_write_t*)malloc(sizeof(inb_gatt_write_t)+data_len);
		if (p_write) {
			p_write->handle = p_trx_clt->start_hdl+TRX_CHAR_VAL_RX+1;
			p_write->auto_execute = true;
			p_write->offset = 0;
			p_write->length = data_len;
			memcpy(p_write->value, p_data, data_len);
			ret = inb_gatt_write( p_trx_clt->peer_conidx, ack ? GATT_WRITE : GATT_WRITE_NO_RESPONSE , p_write, NULL);
			free(p_write);
		}
	}
	return ret;
}

static int enable_ntf(trx_clt_t *p_trx_clt)
{
	int ret = -1;
	inb_gatt_write_t *p_write=NULL;
	
	p_write = (inb_gatt_write_t*)malloc(sizeof(inb_gatt_write_t)+2);
	p_write->handle = p_trx_clt->start_hdl+TRX_CLIENT_CHAR_CFG_TX+1;
	p_write->auto_execute = true;
	p_write->offset = 0;
	p_write->length = 2;
	memcpy(p_write->value, &p_trx_clt->cfg, p_write->length);
	ret = inb_gatt_write( p_trx_clt->peer_conidx, GATT_WRITE, p_write, NULL);
	free(p_write);
	
	return ret;
}
```

### Client Receiving Data

One method for client to get data from server is notification/indication from server. When the server sends data, the client will receive **GATT_EVT_NTF** or **GATT_EVT_IND** event. Event handler needs to be registerd to ble_app component to process the data.

```c
static void evt_peer_evt_ntf(inb_evt_ntf_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);
	
	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false && p_ind->handle == p_trx_clt->start_hdl + TRX_CHAR_VAL_TX + 1)
	{
		if (trx_clt.trx_clt_rx_cb)
			trx_clt.trx_clt_rx_cb(p_ind->conidx, p_ind->value, p_ind->length);
	}
	
	//We'v done so let others handle it
	if (trx_clt.cbf.gatt.evt_peer_evt_ntf)
		trx_clt.cbf.gatt.evt_peer_evt_ntf(p_ind);
}

static void evt_peer_evt_ind(inb_evt_ind_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);

	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false && p_ind->handle == p_trx_clt->start_hdl + TRX_CHAR_VAL_TX + 1)
	{
		if (trx_clt.trx_clt_rx_cb)
			trx_clt.trx_clt_rx_cb(p_ind->conidx, p_ind->value, p_ind->length);

		inb_gatt_indication_cfm(p_ind->conidx, p_ind->handle);
	}
	
	//We'v done so let others handle it
	if (trx_clt.cbf.gatt.evt_peer_evt_ind)
		trx_clt.cbf.gatt.evt_peer_evt_ind(p_ind);
}

int in_trx_clt_add(ble_app_cbf_t *p_cbf, osMessageQId qid, uint8_t svc_uuid[INB_UUID_128_LEN], int (*rx_callback)(int, uint8_t*, int))
{

    ...

	//GATT event
	p_cbf->gatt.evt_peer_evt_ntf = evt_peer_evt_ntf;
	p_cbf->gatt.evt_peer_evt_ind = evt_peer_evt_ind;

    ...

}
```

The difference between **GATT_EVT_NTF** and **GATT_EVT_IND** is an additional <code>inb_gatt_indication_cfm</code> function must be called so that ATT protocol will send response to peer ATT protocol layer. That's why indication is more reliable data transmission of GATT.

Client can also directly poll data from server by ATT read method to characteristic that allow read access permission. In the sample, we don't grant TRX_CHAR_VAL_TX characteristic read access, which can only be notified and indicated. But TRX_CLIENT_CHAR_CFG_TX characteristic is readable so that client can know if server is allowed notification or not.

```c
/**
 ****************************************************************************************
 * @brief Read Attribute 
 * @note This can only issue by the Client.
 *
 * @param[in] conidx				Connection index  
 * @param[in] read_type			Attribute read type, @see enum inb_gatt_read_type
 * @param[in] p_req				Pointer to attribute read paramters
 *
 * @return INB_ERR_NO_ERROR if successful, otherwise failed. @see enum inb_err_t 
 ****************************************************************************************
 */
int inb_gatt_read(int conidx, int read_type, inb_gatt_read_req_t *p_req, comp_cb callback);
```

The actual read result and value are retrived by **GATT_EVT_RD_RSP_IND**, by registering event handler </code>evt_read_rsp_ind</code> to ble_app component.

```c
void evt_read_rsp_ind(inb_evt_read_rsp_ind_t *p_ind)
{
	trx_clt_t *p_trx_clt;

	p_trx_clt = trx_clt_get_by_conidx(p_ind->conidx);

	if (p_trx_clt && trx_clt_is_undisced(p_trx_clt)==false && p_ind->handle == p_trx_clt->start_hdl + TRX_CLIENT_CHAR_CFG_TX + 1)
		p_trx_clt->cfg = *(uint16_t*)p_ind->value;
}

int in_trx_clt_add(ble_app_cbf_t *p_cbf, osMessageQId qid, uint8_t svc_uuid[INB_UUID_128_LEN], int (*rx_callback)(int, uint8_t*, int))
{

    ...

	//GATT event
	p_cbf->gatt.evt_rd_rsp_ind = evt_read_rsp_ind;

	return 0;
}
```

