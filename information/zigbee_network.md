---
---
# Zigbee network

## Device types
In Zigbee, there are three different types of devices: end device, router, and coordinator. A Zigbee network always has **one** (and no more) coordinator, and can have multiple routers and end devices. In the case of Zigbee2MQTT, the coordinator is your CC2531 USB stick.

### End Device
End devices do not route traffic. They may also sleep, which makes end devices a suitable choice for battery operated devices. An end device only has one parent, either the coordinator or a router, generally the closest device when it was paired. All communications to and from the end device is via their parent. If a parent router goes offline all traffic to its children will cease until those end devices time out and attempt to find a new parent. Some models of end device, notably Xiaomi, don't attempt to find a new parent so will remain isolated until re-paired with the network.

*Examples: WXKG01LM, RTCGQ01LM, MCCGQ11LM*

### Router
Routers are responsible for routing traffic between different nodes. Routers may not sleep. As such, routers are not a suitable choice for battery operated devices. Routers are also responsible for receiving and storing messages intended for their children. In addition to this, routers are the gate keepers to the network. They are responsible for allowing new nodes to join the network.

*Examples: LED1545G12, 7146060PH, ZNCZ02LM, [CC2531 USB sniffer flashed with the  router firmware](https://github.com/Koenkk/Z-Stack-firmware/tree/master/router/CC2531/bin)*

*Note: Xiaomi Wall Switches (without neutral line - QBKG03LM and QBKG04LM) are not working as routers in the Zigbee network.*


### Coordinator
A coordinator is a special router. In addition to all of the router capabilities, the coordinator is responsible for forming the network. To do that, it must select the appropriate channel, PAN ID, and extended network address. It is also responsible for selecting the security mode of the network.

*Examples: [CC2531 USB sniffer flashed with the coordinator firmware](https://github.com/Koenkk/Z-Stack-firmware/tree/master/coordinator/Z-Stack_Home_1.2/bin/default)*

### Finding out the type of your device
Zigbee2MQTT logs the device type of your devices on startup, e.g.:
```
2018-5-28 20:39:46 INFO 0x00158d00018255df (0x00158d00018255df): ZNCZ02LM - Xiaomi Mi power plug ZigBee (Router)
2018-5-28 20:39:46 INFO 0x00158d0001b79111 (0x00158d0001b79111): WSDCGQ01LM - Xiaomi MiJia temperature & humidity sensor (EndDevice)
```

## Zigbee networking

This section is an overview of how the zigbee protocol stack divides into layers (See [Wikipedia - IP layers](https://en.wikipedia.org/wiki/Internet_protocol_suite#Layer_names_and_number_of_layers_in_the_literature) ).  The number of layers in this type of description often varies; this discussion uses 4:

1. the physical and MAC layers, 
2. the network and transport layer,
3. the application layer, and
4. the Zigbee2MQTT layer.

Most of the focus will be on the last two layers.

### Physical and MAC layers

The Physical and MAC layers of the Zigbee protocol are defined by [IEEE 802.15.4](https://en.wikipedia.org/wiki/IEEE_802.15.4).  This is a common set of standards that are used by multiple protocol stacks, including Zigbee, 6LoWPAN, Thread and Z-Wave.  There are actually a few different frequency bands that IEEE 802.15.4 can use; the same 2.4 GHz band that WiFi can use, and then an 800 MhZ and a 900MhZ band whose use varies by country.  In general, devices using one stack choose one of these and avoid the others.  For example, Zigbee devices generally use the 2.4 GHz band and Z-Wave devices generally use the 8/900 MHz bands (depending on country).

### The Network and Transport layers

The Network and Transport layers are where the routing, security and transport between the various nodes in a Zigbee network are defined.  This includes things like the network encryption model.  This is also where the difference between the controller, routers and end-nodes is defined in the Zigbee network - see [device types](#device-types).  There is one other Zigbee concept that I’ll put at the transport layer; the concept of Endpoints.  Similar to ports in TCP/IP, Endpoints allow each physical device to have multiple virtual devices on the network.  For example, a 3-gang zigbee switch might have a single radio, and hence only one MAC address and only one zigbee network address, but have three endpoints - one for each switch.  Each endpoint can then run a single ‘switch’ interface.

### The application layer

Zigbee is more than just a networking technology; it defines a bunch of standard applications that run on the network.  These applications are defined in the Zigbee Cluster Library specification (see [Zigbee Cluster Library Specification v7](https://github.com/Koenkk/zigbee-herdsman/raw/master/docs/Zigbee%20Cluster%20Library%20Specification%20v7.pdf)).  Each ‘cluster’ defines one type of application communication.  Each cluster type has its own integer ID, and comes in two flavours; client and server.  There are clusters for low-level information gathering - getting the device model number, listing the endpoints and the clusters each endpoint implements (each endpoint can implement multiple clusters).  There are clusters for simple network setup purposes, such as the Identify cluster which allows someone to ask a device to identify itself, e.g. a light asked to identify itself might start pulsing.  There are clusters for on/off light control, where a light might implement the on/off server cluster and a switch might implement the on/off client cluster.  There are clusters for configuration that allow a controller to configure devices in various ways.

As noted above, each cluster comes in two flavours; client and server.  Generally the server is the endpoint that is running more frequently, and the client chooses to connect to the server.  In many cases this isn’t clear-cut when considering the cluster functionality, so the spec decides pretty much arbitrarily.

The zigbee controller can ‘bind’ the clusters for two endpoints together.  It will connect one endpoint that implements the client variant of a cluster to another endpoint that implements the server variant of the same cluster.

There are also some special clusters.  The ‘group’ cluster allows the definition of ‘groups’ - each defined by a small integer.  If an endpoint implements the group cluster then it can be configured to be part of some number of groups.  The device remembers which groups it is a member of.  A group can then be treated like a virtual endpoint.  Messages sent to a particular group ID are broadcast over the network and all devices that are part of that group will respond to the message.  Similarly, a client can be bound to a group rather than another endpoint, so that, for example, a single switch can control a whole group of lights.

Similarly, the scene cluster allows a device to be configured to remember parameters from other clusters implemented on that device.  A light might remember brightness.  A roller blind might remember a set height.  Each device can remember a small number of scenes, identified by ID.

Scenes and groups are designed to work together.  One might imagine setting up a bunch of different devices, then joining them all into a group, then sending the group a ‘remember scene’ command.  One could then send a ‘recall scene’ command to the group with the appropriate scene ID to cause many devices to configure themselves in a given way with minimal network traffic, and hence minimal latency.

### Zigbee2MQTT

The Zigbee stack has a certain amount of home automation protocol already defined; as discussed, devices can be formed into groups and scenes defined, switches can be bound to those groups.  In such a setup the Zigbee controller might help configure the network, but afterwards it is passive at the application level.

If more flexibility is required than comes in the pre-defined Zigbee clusters, for example “Turn on the fan when the relative humidity is over 70%.”, then you need more clever control.  It is here that Zigbee2MQTT comes in.  It translates between Zigbee and MQTT.

When a device is added to the network with a Zigbee-Herdsman controller, the controller uses the low-level configuration clusters to interview the device and find out what the device is, what endpoints it has, and what clusters each of those endpoints implements.  The Zigbee-Herdsman-Converters then record, for each model of device, which clusters the controller should bind to, and how the conversion to MQTT should be handled.  Most devices in Zigbee-Herdsman-Converters use generic converters that bind to each Zigbee cluster and provide a standard MQTT interface for that cluster.

With this setup, when a switch is activated, it sends a message to the Zigbee2MQTT controller.  The controller then sends out an MQTT message.  The MQTT controller (which is different to the zigbee controller.  e.g. the Home Assistant package) then decides what to do based on that message.  It might, for example, decide to turn on a particular light, so it would send an MQTT message requesting the light to turn on.  Zigbee2MQTT would receive that message, then send a zigbee message to the light’s endpoint using the appropriate zigbee cluster.

This system is significantly more flexible than the base Zigbee system.  But it is also higher latency (it takes longer for the system to react to a switch being toggled) and it has more points of failure.  With the base Zigbee setup, not even the controller is involved once setup is complete.  With the Zigbee2MQTT setup there are two zigbee messages, two MQTT messages, and three extra processing steps (the main controller deciding what to do, and MQTT processing the messages in each direction).

Note that in some commercial Zigbee systems, such as Phillips Hue, the controller node in the zigbee network is also the automation controller that can add additional smarts on top of the base Zigbee setup.  Zigbee2MQTT inserts MQTT between the two allowing them to be decoupled.
