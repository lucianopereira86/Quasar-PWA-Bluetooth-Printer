![titulo](/docs/titulo.jpg)

# Quasar PWA Bluetooth Printer (quasar-pwa-bluetooth-printer)

Example of a Quasar PWA connecting with a Bluetooth thermal printer

## Technologies

- Quasar v1.0
- PWA
- Bluetooth
- Thermal Printer

## Objective

In this project, you will learn how to connect a Quasar PWA with a thermal printer by Bluetooth to print messages.
The device we have used for this test is available [here](https://produto.mercadolivre.com.br/MLB-1152109815-mini-impressora-portatil-sem-fio-termica-58mm-android-ios-_JM?variation=38844821001&quantity=1#reco_item_pos=0&reco_backend=machinalis-seller-items&reco_backend_type=low_level&reco_client=vip-seller_items-above&reco_id=ee52e224-75cf-4ff6-8878-aee8c8569d66).

![printer01](/docs/printer01.jpg)

This model doesn't recognize special characters, so the correspondent ASCII characters will replace them.

You can test the demo at [Surge](https://quasar-pwa-bluetooth-printer.surge.sh).

## How to run this project

Install the dependencies.
```bash
npm install
```

Run the app.
```bash
quasar dev -m pwa
```

Detect your local IP address.
```bash
ipconfig
```

Open a Chrome tab in your mobile phone and access this link.
```bash
https://<YOUR-IP>:8080
```

The main screen is very simple. Only a textarea and a button. 

![quasar01](/docs/quasar01.jpg)

Type a simple message.

![quasar02](/docs/quasar02.jpg)

The printer must be on and waiting for connection. No previous pairing is needed.

![printer02](/docs/printer02.jpg)

By pressing the "Print" button, a popup listing the available Bluetooth devices will be opened.

![quasar03](/docs/quasar03.jpg)

Select the "Bluetooth Printer" option and press on "Pair". If it asks for a code, probably it will be 1234.

![quasar04](/docs/quasar04.jpg)

The result will be this. If it didnt work, probably the printer has connection issues. Restart it and try it again.

![printer03](/docs/printer03.jpg)

Now, let's type a long message to see how the printer will break the lines.

![quasar05](/docs/quasar05.jpg)

This will be the result.

![printer04](/docs/printer04.jpg)

## Behind the code

There are some parts of the code that need some attention.

The "/src/pages/Index.vue" file contains the "navigator.bluetooth" which is the object responsible for the Bluetooth connection. Accordingly to the [docs](https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice):

>The Bluetooth.requestDevice() method of the Bluetooth interface returns a Promise to a BluetoothDevice object with the specified options. If there is no chooser UI, this method returns the first device matching the criteria."

![code01](/docs/code01.jpg)

The characteristics of the data are provided to the device's [GATT](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt).

![code02](/docs/code02.jpg)

If the message is sent by a mobile device such as an Android phone, the amount of data to be transfered at once is limited.

![code03](/docs/code03.jpg)

Each part of the message is transferred separately before the connection ends.

![code04](/docs/code04.jpg)