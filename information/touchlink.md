# Touchlink
*NOTE: Touchlink is not supported for Deconz adapters (e.g. Conbee II)*

Touchlink is a feature of Zigbee which allows devices physically close to each other to communicate with each other **without** being in the same network.

Note that not all Zigbee devices support Touchlink, but most bulbs of common brands like Philips and IKEA support this.

## Scan
This allows to scan for Touchlink enabled devices. The outcome of this scan can be used later to determine what device to factory reset. To scan send a MQTT message to `zigbee2mqtt/bridge/request/touchlink/scan` with an empty payload.
The response will be send to `zigbee2mqtt/bridge/response/touchlink/scan`, example payload: `{"data":{"found":[{ieee_address: '0x12345678', channel: 12}, {ieee_address: '0x12654321', channel: 24}]},"status":"ok"}`.

## Identify
This allows to identify (e.g. bulb blinking) a device via Touchlink. To identify send a MQTT message to `zigbee2mqtt/bridge/request/touchlink/identify` with payload e.g. `{ieee_address: '0x12345678', channel: 12}` (use scan from above to determine `ieee_address` and `channel`).

## Factory reset device
Zigbee2MQTT allows to factory reset devices through Touchlink. This is especially handy for e.g. Philips Hue bulbs as they cannot be factory resetted by turning them on/off 5 times. Demo: [video](https://www.youtube.com/watch?v=kcRj77YGyKk)

To factory reset a device through Touchlink bring the device close (< 10 cm) to your coordinator (e.g. CC2531 adapter). After this send a MQTT message to `zigbee2mqtt/bridge/request/touchlink/factory_reset` with an empty payload.

Zigbee2MQTT will now start scanning, this can take up to 1 minute and during this scan **your network cannot be used**. After some time the device will identify itself (e.g. a bulb will start to blink).

Now that your device has been factory reset, it will automatically join Zigbee2MQTT (make sure that joining is enabled through `permit_join: true`). If it doesn't, try powering the bulb off and on 1 time.

In case you want to factory reset a specific device (which can be found through a scan, see above) request the factory reset with the following payload: `{ieee_address: '0x12345678', channel: 12}`.