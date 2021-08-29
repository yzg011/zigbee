---
---
# Scenes
Scenes allow to quickly set certain states for a device or group.
Most of the time this is used for bulbs or a group of bulbs as it allows to set a certain color and brightness with a single command.

## Creating a scene
Scenes can be created in two ways, by storing the current state (`scene_store`) or by adding a scene (`scene_add`). Note that `scene_store` and `scene_add` will override each other if the same `SCENE_ID` is used.

### `scene_store`
This is the easiest way to create a scene. First set the device or group in the desired state. Next store the current state as a scene by sending a command to `zigbee2mqtt/[GROUP_OR_DEVICE_FRIENDLY_NAME]/set` with payload `{"scene_store": SCENE_ID}` where `SCENE_ID` is a number (e.g. `1`).

### `scene_add`
`scene_add` provides two benefits over `scene_store`: you can control which attributes will be stored in the scene (e.g. only brightness) and it's possible to set a transition time. You can execute a `scene_add` by sending to `zigbee2mqtt/[GROUP_OR_DEVICE_FRIENDLY_NAME]/set` with payload:

```js
{
    "scene_add": {
        "ID": 3, // the SCENE_ID
        "transition": 3, // optional: transition time of the scene in seconds (default = 0 seconds)
        // Properties below are all optional, note that it's not possible to use both 'color_temp' and 'color'
        // Attributes not specified will stay as-is when the scene is recalled.
        "state": "ON", // state, should be 'ON' or 'OFF'
        "brightness": 254, // brightness (0 - 254)
        "color_temp": 0, // color temperature (0 - 500) OR
        "color": {"hue": 0, "saturation": 100}, // color in hue/saturation (if both hue, saturation, x, and y are specifies x/y is used) OR
        "color": {"x": 0.123, "y": 0.123}, // color in x/y OR
        "color": "#0000FF" // color in hex notation (saved as x/y)
    }
}
```

In case a `scene_store` is called with the same `SCENE_ID` all values except the `transition` are overridden. In this way it's possible to have a transition for a scene created through `scene_store`.

## Recall scene
To recall the scene send a command to `zigbee2mqtt/[GROUP_OR_DEVICE_FRIENDLY_NAME]/set` with payload `{"scene_recall": SCENE_ID}` where `SCENE_ID` is a number (e.g. `1`).

## Remove scene
To remove a scene send a command to `zigbee2mqtt/[GROUP_OR_DEVICE_FRIENDLY_NAME]/set` with payload `{"scene_remove": SCENE_ID}` where `SCENE_ID` is a number (e.g. `1`).

Alternatively if you want to remove all scenes send a command to `zigbee2mqtt/[GROUP_OR_DEVICE_FRIENDLY_NAME]/set` with payload `{"scene_remove_all": ""}`
