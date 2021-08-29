---
---
# MQTT topics and message structure

This page describes which MQTT topics are used by Zigbee2MQTT. Note that the base topic (by default `zigbee2mqtt`) is configurable in the [Zigbee2MQTT `configuration.yaml`](../information/configuration.md). In Zigbee2MQTT 1.17.0 a new API was introduced, the documentation of the legacy api can be found [here](https://github.com/Koenkk/zigbee2mqtt.io/blob/ead922ee141546ccce079430a7acce67c982c99b/docs/information/mqtt_topics_and_message_structure.md).

## zigbee2mqtt/FRIENDLY_NAME
Where `FRIENDLY_NAME` is e.g. `0x00158d0001b79111`. Message published to this topic are **always** in a JSON format. Each device produces a different JSON message. To see what your device publishes check the "Exposes" section on the device page which can be accessed via ["Supported devices"](./supported_devices.md). Some examples:

**Xiaomi MiJia temperature & humidity sensor (WSDCGQ01LM)**
```json
{
  "temperature": 27.34,
  "humidity": 44.72
}
```

**Xiaomi MiJia wireless switch (WXKG01LM)**
```json
{
  "action": "single"
}
```

**Xiaomi MiJia human body movement sensor (RTCGQ01LM)**
```json
{
  "occupancy": true
}
```

**IKEA TRADFRI LED bulb E27 980 lumen, dimmable, white spectrum, opal white (LED1545G12)**
```json
{
  "state": "ON",
  "brightness": 215,
  "color_temp": 325
}
```

## zigbee2mqtt/FRIENDLY_NAME/set
Publishing messages to this topic allows you to control your Zigbee devices via MQTT. Only accepts JSON messages. An example to control a Philips Hue Go (7146060PH). How to control a specific device can be found in the "Exposes" section on the device page which can be accessed via ["Supported devices"](./supported_devices.md).

```js
{
  "state": "ON", // Or "OFF", "TOGGLE"
  "brightness": 255, // Value between 0 and 255
  "color": {"x": 0.123, "y": 0.123} // Color in XY
}
```

### Without JSON
In case you don't want to use JSON, publishing to `zigbee2mqtt/[FRIENDLY_NAME]/set/state` with payload `ON` is the same as publishing to `zigbee2mqtt/[FRIENDLY_NAME]/set` payload `{"state": "ON"}`.

## zigbee2mqtt/[FRIENDLY_NAME]/get
This is the counterpart of the `set` command. It allows you to read a value from a device. To read e.g. the state of a device send the payload `{"state": ""}`. What you can `/get` is specified on the device page under the "Exposes" section.

## zigbee2mqtt/bridge/info
Contains information of the bridge.
Whenever one of the attributes in the payload changes, this is republished.
Example payload:

```json
{
    "version":"1.13.0-dev",
    "commit":"772f6c0",
    "coordinator":{
        "type":"zStack30x",
        "meta":{"revision":20190425, "transportrev":2, "product":2, "majorrel":2, "minorrel":7, "maintrel":2}
    },
    "network":{"channel":15,"pan_id":5674,"extended_pan_id":[0,11,22]},
    "log_level":"debug",
    "permit_join":true,
    "permit_join_timeout": 10, // Time in seconds till permit join is disabled, `undefined` in case of no timeout
    "config": {...}, // Will contain the complete Zigbee2MQTT config expect the network_key
    "config_schema": {...}, // Will contain the JSON schema of the config
    "restart_required": false // Indicates wether Zigbee2MQTT needs to be restarted to apply options set through zigbee2mqtt/request/bridge/options
}
```

## zigbee2mqtt/bridge/state
Contains the state of the bridge, payloads are:
* `online`: published when the bridge is running (on startup)
* `offline`: published right before the bridge stops

## zigbee2mqtt/bridge/logging
All Zigbee2MQTT logging is published to this topic in the form of `{"level": LEVEL, "message": MESSAGE}`, example: `{"level": "info", "message": "Zigbee: allowing new devices to join."}`.

## zigbee2mqtt/bridge/devices
Contains the devices connected to the bridge.
Whenever a devices joins or leaves this is republished.
In case `supported` is `false`, `definition` will be `null`.
Example payload:

```json
[
    {
        "ieee_address":"0x00158d00018255df",
        "type":"Router",
        "network_address":29159,
        "supported":true,
        "friendly_name":"my_plug",
        "endpoints":{"1":{"bindings":[],"configured_reportings":[],"clusters":{"input":["genOnOff","genBasic"],"output":[]}}},
        "definition":{
            "model":"ZNCZ02LM",
            "vendor":"Xiaomi",
            "description":"Mi power plug ZigBee"
        },
        "power_source":"Mains (single phase)",
        "date_code":"02-28-2017",
        "model_id":"lumi.plug",
        "interviewing":false,
        "interview_completed":true
    },
    {
        "ieee_address":"0x90fd9ffffe6494fc",
        "type":"Router",
        "network_address":57440,
        "supported":true,
        "friendly_name":"my_bulb",
        "endpoints":{"1":{"bindings":[],"configured_reportings":[],"clusters":{"input":["genOnOff","genBasic","genLevelCtrl"],"output":["genOta"]}}},
        "definition":{
            "model":"LED1624G9",
            "vendor":"IKEA",
            "description":"TRADFRI LED bulb E14/E26/E27 600 lumen, dimmable, color, opal white",
            "exposes":[{"type":"light","features":["state","brightness","color_xy"]}],
        },
        "power_source":"Mains (single phase)",
        "software_build_id":"1.3.009",
        "model_id":"TRADFRI bulb E27 CWS opal 600lm",
        "date_code":"20180410",
        "interviewing":false,
        "interview_completed":true
    },
    {
        "ieee_address":"0x00169a00022256da",
        "type":"Router",
        "endpoints":{
          "1":{
            "bindings":[
              {"cluster":"genOnOff","target":{"type":"endpoint","endpoint":1,"ieee_address":"0x000b57fffec6a5b3"}},
              {"cluster":"genOnOff","target":{"type":"group","id":1}},
            ],
            "configured_reportings":[
              {"cluster":"genOnOff","attribute":"onOff","maximum_report_interval":10,"minimum_report_interval":1,"reportable_change":1}
            ],
            "clusters":{"input":["genBasic","msIlluminanceMeasurement"],"output":["genOnOff"]}
          }
        },
        "network_address":22160,
        "supported":false,
        "friendly_name":"my_sensor",
        "definition":null,
        "power_source":"Battery",
        "date_code":"04-28-2019",
        "model_id":null,
        "interviewing":false,
        "interview_completed":true
    },
    {
        "ieee_address":"0x00124b00120144ae",
        "type":"Coordinator",
        "network_address":0,
        "supported":false,
        "endpoints":{"1":{"bindings":[],"configured_reportings":[],"clusters":{"input":[],"output":[]}}},
        "friendly_name":"Coordinator",
        "definition":null,
        "power_source":null,
        "date_code":null,
        "model_id":null,
        "interviewing":false,
        "interview_completed":true
    },
]
```

### Exposes
A device definition will always have an `exposes` property. The format of `exposes` is documented in [Exposes](./exposes).

## zigbee2mqtt/bridge/groups
Contains the groups.
Whenever a group is added/removed or when devices are added/removed from a group this is republished.
Example payload:

```json
[
    {
        "id":1,
        "friendly_name":"my_group",
        "members":[
            {
                "ieee_address":"0x90fd9ffffe6494fc",
                "endpoint":1
            }
        ]
    }
]
```

## zigbee2mqtt/bridge/event
Events will be published to this topic. Possible types are `device_joined`, `device_interview`, `device_leave`, `device_announce`. Example payloads:
- `{"type":"device_joined","data":{"friendly_name":"0x90fd9ffffe6494fc","ieee_address":"0x90fd9ffffe6494fc"}}`
- `{"type":"device_announce","data":{"friendly_name":"0x90fd9ffffe6494fc","ieee_address":"0x90fd9ffffe6494fc"}}`
- `{"type":"device_interview","data":{"friendly_name":"0x90fd9ffffe6494fc","status":"started","ieee_address":"0x90fd9ffffe6494fc"}}`
- `{"type":"device_interview","data":{"friendly_name":"0x90fd9ffffe6494fc","status":"successful","ieee_address":"0x90fd9ffffe6494fc","supported":true,"definition":{"model":"LED1624G9","vendor":"IKEA","description":"TRADFRI LED bulb E14/E26/E27 600 lumen, dimmable, color, opal white"}}}`
- `{"type":"device_interview","data":{"friendly_name":"0x90fd9ffffe6494fc","status":"failed","ieee_address":"0x90fd9ffffe6494fc"}}`
- `{"type":"device_leave","data":{"ieee_address":"0x90fd9ffffe6494fc","friendly_name":"my_bulb"}}`

## zigbee2mqtt/bridge/extensions
See [User extensions](./user_extensions.md).

## zigbee2mqtt/bridge/request/+
This can be used to e.g. configure certain settings like allowing new devices to join. Zigbee2MQTT will always respond with the same topic on `zigbee2mqtt/bridge/response/+`. The response payload will at least contain a `status` and `data` property, `status` is either `ok` or `error`. If `status` is `error` it will also contain an `error` property containing a description of the error.

Example: when publishing `zigbee2mqtt/bridge/request/permit_join` with payload `{"value": true}` Zigbee2MQTT will respond to `zigbee2mqtt/bridge/response/permit_join` with payload `{"data":{"value":true},"status":"ok"}`. In case this request failed the response will be `{"data":{}, "error": "Failed to connect to adapter","status":"error"}`.

Optionally, a `transaction` property can be included in the request. This allows to easily match requests with responses. When a `transaction` property is included Zigbee2MQTT will include it in the response. Example: `zigbee2mqtt/bridge/request/permit_join` with payload `{"value": true, "transaction":23}` will be responded to on `zigbee2mqtt/bridge/response/permit_join` with payload `{"data":{"value":true},"status":"ok","transaction":23}`.

For requests where a device is involved you can select a specific endpoint by adding `/ENDPOINT_ID` where `ENDPOINT_ID` is the endpoint number (e.g `1`, `2`) or the endpoint name (e.g. `left`, `l1`). By default the first endpoint is taken. Example of a `zigbee2mqtt/bridge/request/device/bind` payload: `{"from": "my_remote/left", "to": "my_bulb"}`.

### Possible requests

### General

#### zigbee2mqtt/bridge/request/permit_join

Allows to permit or disable joining of new devices. Allowed payloads are `{"value": true}`, `{"value": false}`, `true` or `false`. Example response: `{"data":{"value":true},"status":"ok"}`. This is not persistent (will not be saved to `configuration.yaml`).

To allow joining via a specific device set the `friendly_name` in the `device` property. E.g. `{"value": true, "device": "my_bulb"}`.

To allow joining for only a specific amount of time add the `time` property (in seconds). E.g. `{"value": true, "time": 20}` (will allow joining for 20 seconds).

#### zigbee2mqtt/bridge/request/health_check

Allows to check wether Zigbee2MQTT is healthy. Payload has to be empty, example response: `{"data":{"healthy":true},"status":"ok"}`.

#### zigbee2mqtt/bridge/request/restart

Restarts Zigbee2MQTT. Payload has to be empty, example response: `{"data":{},"status":"ok"}`.

#### zigbee2mqtt/bridge/request/networkmap

**WARNING: During the networkmap scan your network will be not/less responsive. Depending on the size of your network this can take somewhere between 10 seconds and 2 minutes. Therefore it is recommended to only trigger these scans manually!**

Allows you to retrieve a map of your Zigbee network. Payload format is `{"type": TYPE, "routes": BOOL}` or `TYPE`, example: `graphviz`, response `{"data":{"value": "NETWORKMAP","type":"graphviz","routes":false},"status":"ok"}`. Possible types are `raw`, `graphviz` and `plantuml`. In case you want to include routes set `routes` to `true`, `routes` is optional and is `false` by default.

Use [webgraphviz.com](http://www.webgraphviz.com/) (for `graphviz`), [planttext.com](https://www.planttext.com/) (for `plantuml`), or other tools to generate the network graph.

The graphviz map shows the devices as follows:
* **Coordinator:** rectangle with bold outline
* **Router:** rectangle with rounded corners
* **End device:** rectangle with rounded corners and dashed outline

Links are labelled with link quality (0..255) and active routes (listed by short 16 bit destination address). Arrow indicates direction of messaging. Coordinator and routers will typically have two lines for each connection showing bi-directional message path. Line style is:
* To **end devices**: normal line
* To and between **coordinator** and **routers**: heavy line for active routes or thin line for no active routes


#### zigbee2mqtt/bridge/request/extension/save

See [User extensions](./user_extensions.md).

### Device

#### zigbee2mqtt/bridge/request/device/remove

Removes a device from the network. Allowed payloads are `{"id": "deviceID"}` or `deviceID` where deviceID can be the `ieee_address` or `friendly_name` of the device. Example; request: `{"id": "my_bulb"}` or `my_bulb`, response: `{"data":{"id": "my_bulb","block":false,"force":false},"status":"ok"}`.

Note that in Zigbee the coordinator can only **request** a device to remove itself from the network.
Which means that in case a device refuses to respond to this request it is not removed from the network.
This can happen for e.g. battery powered devices which are sleeping and thus not receiving this request.
In case removal fails the reponse will be e.g. `{"data":{"id": "my_bulb","block":false,"force":false},"status":"error","error":"Failed to remove dimmer (Error: AREQ - ZDO - mgmtLeaveRsp after 10000ms)"}`.

An alternative way to remove the device is by factory resetting it, this probably won't work for all devices as it depends on the device itself.
In case the device did remove itself from the network, you will get a `device_leave` event on `zigbee2mqtt/bridge/event`.

In case all of the above fails, you can force remove a device. Note that a force remove will **only** remove the device from the database. Until this device is factory reset, it will still hold the network encryption key and thus is still able to communicate over the network!
To force remove a device add the optional `force` property (default `false`) to the payload, example: `{"id":"my_bulb","force":true}`.

In case you also want to block the device the optional `block` property (default `false`) can be added, example: `{"id":"my_bulb","block":true}`. Note that Zigbee doesn't have a block functionallity, therefore when a device is blocked, Zigbee2MQTT will immediately request the device to remove itself from the network when it joins.


#### zigbee2mqtt/bridge/request/device/ota_update/check

See [OTA updates](./ota_updates.md).


#### zigbee2mqtt/bridge/request/device/ota_update/update

See [OTA updates](./ota_updates.md).


#### zigbee2mqtt/bridge/request/device/configure

Allows to manually trigger a re-configure of the device. Should only be used when the device is not working as expected (e.g. not reporting certain values), not all devices can be configured (only when the defintion has a `configure` in its [definition](https://github.com/Koenkk/zigbee-herdsman-converters/blob/master/devices)). Allowed payloads are `{"id": "deviceID"}` or `deviceID` where deviceID can be the `ieee_address` or `friendly_name` of the device. Example; request: `{"id": "my_remote"}` or `my_remote`, response: `{"data":{"id": "my_remote"},"status":"ok"}`.


#### zigbee2mqtt/bridge/request/device/options

Allows you to change device options on the fly. Existing options can be changed or new ones can be added. Payload format is `{"id": deviceID,"options": OPTIONS}` where deviceID can be the `ieee_address` or `friendly_name` of the device, example: `{"id": "my_bulb", "options":{"transition":1}}`. Response will be `{"data":{"from":{"retain":false},"to":{"retain":false,"transition":1},"id":"my_bulb"},"status":"ok"}`.


#### zigbee2mqtt/bridge/request/device/rename

Allows you to change the `friendly_name` of a device on the fly. Payload format is `{"from": deviceID, "to": deviceID}` where deviceID can be the `ieee_address` or `friendly_name` of the device, example: `{"from": "my_bulb", "to": "my_bulb_new_name"}`. Response will be `{"data":{"from":"my_bulb","to":"my_bulb_new_name","homeassistant_rename":false},"status":"ok"}`.

In case you are using Home Assistant discovery and also want to update the entity ID according to this new name, send e.g. `{"from": "my_bulb", "to": "my_bulb_new_name","homeassistant_rename":true}`

In case you want to rename the last joined device, omit the `from` property and set `last` to `true`. Example: `{"last": true, "to": "my_bulb_new_name"}`.


#### zigbee2mqtt/bridge/request/device/bind

See [Binding](./binding.md).


#### zigbee2mqtt/bridge/request/device/unbind

See [Binding](./binding.md).


#### zigbee2mqtt/bridge/request/device/configure_reporting

Allows to send a Zigbee configure reporting command to a device. Refer to the Configure Reporting Command in the [ZigBee Cluster Library](https://github.com/Koenkk/zigbee-herdsman/blob/master/docs/Zigbee%20Cluster%20Library%20Specification%20v7.pdf) for more information. Example payload is `{"id":"my_bulb","cluster":"genLevelCtrl","attribute":"currentLevel","minimum_report_interval":5,"maximum_report_interval":10,"reportable_change":10}`. In this case the repsponse would be `{"data":{"id":"my_bulb","cluster":"genLevelCtrl","attribute":"currentLevel","minimum_report_interval":5,"maximum_report_interval":"10","reportable_change":10},"status":"ok"}`.

To disable reporting set the `maximum_report_interval` to `65535`.

Notes:
- Not all devices support the Zigbee configure reporting command (e.g. Xiaomi WSDCGQ11LM temperature/humidity sensors don't support it)
- If configure reporting fails for a battery powered device make sure to wake it up right before sending the command.
- The `reportable_change` value depends on the unit of the attribute, e.g. for temperature 100 means in general 1°C of change.


### Group

#### zigbee2mqtt/bridge/request/group/remove

Removes a group. Allowed payloads are `{"id": "groupID"}` or `groupID` where groupID can be the `groupID` or `friendly_name` of the group. Example; request: `{"id": "my_group"}` or `my_group`, response: `{"data":{"id": "my_group", "force": false},"status":"ok"}`.

Group removal can fail if one of the devices fails to remove itself from the group (e.g. due to being offline). In this case you can force a group removal by setting the optional `force` property to `true`, example payload `{"id": "my_group", "force": true}`. Note that in this case the device will still be in the group, in case the groupID is later reused, the device will be part of that group.


#### zigbee2mqtt/bridge/request/group/add

Adds a group. Allowed payloads are `{"friendly_name": NAME, "id": NUMBER}` or `NAME`. Example; request: `{"id": 9, "friendly_name": "new_group"}` or `new_group`, response: `{"data":{"id": 9,"friendly_name":"new_group"},"status":"ok"}`. The `id` property is optional.


#### zigbee2mqtt/bridge/request/group/rename

Allows you to change the `friendly_name` of a group on the fly. Payload format is `{"from": groupID, "to": groupID}` where groupID can be the `groupID` or `friendly_name` of the group, example: `{"from": "my_group", "to": "my_group_new_name"}`. Response will be `{"data":{"from":"my_group","to":"my_group_new_name"},"status":"ok"}`.


#### zigbee2mqtt/bridge/request/group/options

Allows you to change group options on the fly. Existing options can be changed or new ones can be added. Payload format is `{"id": groupID,"options": OPTIONS}` where groupID can be the `group_ID` or `friendly_name` of the group, example: `{"id": "my_group", "options":{"transition":1}}`. Response will be `{"data":{"from":{"retain":false},"to":{"retain":false,"transition":1},"id":"my_group"},"status":"ok"}`.


#### zigbee2mqtt/bridge/request/group/members/add

See [Groups](./groups.md).


#### zigbee2mqtt/bridge/request/group/members/remove

See [Groups](./groups.md).


#### zigbee2mqtt/bridge/request/group/members/remove_all

See [Groups](./groups.md).

### Configuration

#### zigbee2mqtt/bridge/request/options

Allows to set any option. The JSON schema of this can be found [here](https://github.com/Koenkk/zigbee2mqtt/blob/master/lib/util/settings.schema.json) (is also published to `zigbee2mqtt/bridge/info` in the `config_schema` property). Example to set `permit_join`; send to `zigbee2mqtt/bridge/request/options` payload `{"options": {"permit_join": true}}`, response: `{"data":{"restart_required": false},"status":"ok"}`. Some options may require restarting Zigbee2MQTT, in this case `restart_required` is set to `true`. Note that `restart_required` is also published to `zigbee2mqtt/bridge/info`. Use `zigbee2mqtt/bridge/request/restart` to restart Zigbee2MQTT.

#### zigbee2mqtt/bridge/request/config/last_seen

**Deprecated:** use `zigbee2mqtt/bridge/request/options` with payload `{"options": {"advanced": {"last_seen": VALUE}}}` instead.

Sets `advanced` -> `last_seen` (persistent). Payload format is `{"value": VALUE}` or `VALUE`, example: `{"value":"disable"}`, response: `{"data":{"value": "disable"},"status":"ok"}`. See [Configuration](../information/configuration.md) for possible values.


#### zigbee2mqtt/bridge/request/config/elapsed

**Deprecated:** use `zigbee2mqtt/bridge/request/options` with payload `{"options": {"advanced": {"elapsed": VALUE}}}` instead.

Sets `advanced` -> `elapsed` (persistent). Payload format is `{"value": VALUE}` or `VALUE`, example: `{"value":true}`, response: `{"data":{"value": true},"status":"ok"}`. See [Configuration](../information/configuration.md) for possible values.


#### zigbee2mqtt/bridge/request/config/log_level

**Deprecated:** use `zigbee2mqtt/bridge/request/options` with payload `{"options": {"advanced": {"log_level": VALUE}}}` instead.

Sets `advanced` -> `log_level` (persistent). Payload format is `{"value": VALUE}` or `VALUE`, example: `{"value":"debug"}`, response: `{"data":{"value": "debug"},"status":"ok"}`. See [Configuration](../information/configuration.md) for possible values.


#### zigbee2mqtt/bridge/request/config/homeassistant

**Deprecated:** use `zigbee2mqtt/bridge/request/options` with payload `{"options": {"homeassistant": true}}` instead.

Enable or disable the Home Assistant integration on the fly (persistent). Payload format is `{"value": VALUE}` or `VALUE`, example: `{"value":true}`, response: `{"data":{"value": "true"},"status":"ok"}`. Possible values are `true` or `false`.

### Touchlink


#### zigbee2mqtt/bridge/request/touchlink/factory_reset

See [Touchlink](./touchlink.md).


#### zigbee2mqtt/bridge/request/touchlink/scan

See [Touchlink](./touchlink.md).


#### zigbee2mqtt/bridge/request/touchlink/identify

See [Touchlink](./touchlink.md).
