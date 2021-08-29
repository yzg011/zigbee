---
---
# Debug

In case Zigbee2MQTT isn't working as expected the following tips can help you in finding the problem.

## Enabling logging

### Zigbee2MQTT debug logging
To enable debug logging for Zigbee2MQTT add the following in your `configuration.yaml`

```yaml
advanced:
  log_level: debug
```

### Zigbee-herdsman debug logging
To enable debug logging for Zigbee-herdman start Zigbee2MQTT with: `DEBUG=zigbee-herdsman* npm start`. Zigbee-herdsman is the Zigbee library where Zigbee2MQTT is based up-on.

**Important:** this is **not** logged to the log files and is only available on the STDOUT.

### Docker
To enable debug logging in the Zigbee2MQTT Docker container add `-e DEBUG=zigbee-herdsman*` to your `docker run` command.

### Home Assistant OS/Supervised addon
- Go to `Supervisor` in the main menu and click on the `Zigbee2MQTT` addon.
- In the top tabs, click on `Configuration`
- Add the following to the end of the file, with no spaces or tabs preceding it:
  `zigbee_herdsman_debug: true`
- Click `Save`, and when prompted to restart, click `Restart add-on`

Herdsman debug logs should now sow up on the `Logs` tab for the addon.

## Change log level during runtime
See [MQTT topics and message structure](../information/mqtt_topics_and_message_structure.md)
