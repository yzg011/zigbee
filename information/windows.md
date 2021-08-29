# Running Zigbee2MQTT on Windows

Since Node.js is fully cross-platform it is possible to run Zigbee2MQTT on Windows.

Before you start make sure you have [already flashed](../information/flashing_the_cc2531.html) your Zigbee adapter with the appropriate firmware.

## 1. Determine which COM port is assigned to your device

1. Connect your sniffer device
1. Open up Start menu and start typing `Device Manager`
1. Expand `Ports (COM & LPT)`
1. Look for a node similar to `USB Serial Device (COM4)`
1. Take note of the port number, it will be needed during configuration

![Device Manager](../images/devicemanager.png)

## 2. Installing

1. Download and install Node.js 10 LTS from [their website](https://nodejs.org/en/)
1. Open up a `Command prompt` or `Powershell` from the Start menu (Powershell has prettier colors)
1. Verify Node.js was successfully installed
    ```bash
    node --version
    ```
1. Choose a suitable directory for Zigbee2MQTT and copy all the files from the [Zigbee2MQTT repository](https://github.com/koenkk/zigbee2mqtt)
    * if you prefer to use git (which you should), just clone the whole repository
        ```bash
        git clone git@github.com:Koenkk/zigbee2mqtt.git
        ```
    * otherwise use the green `Clone or download` button to download the zip archive, then extract it
1. Change to the newly created directory and install dependencies with Node.js' own package manager `npm`
    ```bash
    npm ci
    ```

## 3. Configuring

1. Open `data\configuration.yaml` in a text editor
1. Change the serial port configuration to match your setup
    ```yaml
    serial:
        port: \\.\COM4
    ```
1. Make sure other settings are correct as well
1. Save and exit

Congratulations, you're now ready to start your Zigbee2MQTT installation

## 4. Starting Zigbee2MQTT

Just change to the root directory of your installation and run the application:
```bash
npm start
```

A successful setup produces an output similar to this:

```
> zigbee2mqtt@1.6.0 start C:\Users\me\Documents\GitHub\zigbee2mqtt
> node index.js

  Zigbee2MQTT:info 2019-10-18 10:56:22 PM Logging to directory: 'D:\Documents\GitHub\zigbee2mqtt\data\log\2019-10-18.22-56-22'
  Zigbee2MQTT:info 2019-10-18 10:56:22 PM Starting Zigbee2MQTT version 1.6.0 (commit #e26ad2a)
  Zigbee2MQTT:info 2019-10-18 10:56:22 PM Starting zigbee-shepherd
  Zigbee2MQTT:info 2019-10-18 10:56:24 PM zigbee-shepherd started
  Zigbee2MQTT:info 2019-10-18 10:56:24 PM Coordinator firmware version: '20190608'
```

The `Coordinator firmware version: '20190608'` entry means that Zigbee2MQTT has successfully communicated with the USB sniffer.

Zigbee2MQTT can be stopped anytime by pressing `CTRL + C` and then confirming with `Y` (on English locales at least).
