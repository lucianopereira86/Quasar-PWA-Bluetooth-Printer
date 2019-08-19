<template>
  <q-page class="flex flex-center">
    <div style="width:50vw">
      <div>
        <q-input
          label="Message"
          v-model="msg"
          type="textarea"
          class="text-black full-width"
          style="height:100px"
          rows="10"
        />
      </div>
      <div class="text-center q-mt-md">
        <q-btn color="primary" class="full-width" @click="print()">Print</q-btn>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      msg: '',
      printCharacteristic: null,
      isMobile: this.$q.platform.is.mobile
    }
  },
  methods: {
    print () {
      navigator.bluetooth
        .requestDevice(
          {
            filters: [
              {
                name: 'BlueTooth Printer',
                services: ['000018f0-0000-1000-8000-00805f9b34fb']
              }
            ]
          },
          {
            optionalServices: ['00002af1-0000-1000-8000-00805f9b34fb']
          }
        )
        .then(device => {
          console.log('device', device)
          if (device.gatt.connected) {
            device.gatt.disconnect()
          }
          console.log('connect')
          return this.connect(device)
        })
        .catch(this.handleError)
    },
    connect (device) {
      const self = this
      device.addEventListener('gattserverdisconnected', this.onDisconnected)
      return device.gatt
        .connect()
        .then(server =>
          server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
        )
        .then(service =>
          service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')
        )
        .then(characteristic => {
          console.log('characteristic', characteristic)
          self.printCharacteristic = characteristic
          self.sendTextData(device)
        })
        .catch(error => {
          this.handleError(error, device)
        })
    },
    handleError (error, device) {
      console.error('handleError => error', error)
      if (device != null) {
        device.gatt.disconnect()
      }
      let erro = JSON.stringify({
        code: error.code,
        message: error.message,
        name: error.name
      })

      console.log('handleError => erro', erro)
      if (error.code !== 8) {
        this.$q.notify('Could not connect with the printer. Try it again')
      }
    },
    getBytes (text) {
      console.log('text', text)
      let br = '\u000A\u000D'
      text = text === undefined ? br : text
      let replaced = this.$languages.replace(text)
      console.log('replaced', replaced)
      let bytes = new TextEncoder('utf-8').encode(replaced + br)
      console.log('bytes', bytes)
      return bytes
    },
    addText (arrayText) {
      let text = this.msg
      arrayText.push(text)
      if (this.isMobile) {
        while (text.length >= 20) {
          let text2 = text.substring(20)
          arrayText.push(text2)
          text = text2
        }
      }
    },
    sendTextData (device) {
      let arrayText = []
      this.addText(arrayText)
      console.log('sendTextData => arrayText', arrayText)
      this.loop(0, arrayText, device)
    },
    loop (i, arrayText, device) {
      let arrayBytes = this.getBytes(arrayText[i])
      this.write(device, arrayBytes, () => {
        i++
        if (i < arrayText.length) {
          this.loop(i, arrayText, device)
        } else {
          let arrayBytes = this.getBytes()
          this.write(device, arrayBytes, () => {
            device.gatt.disconnect()
          })
        }
      })
    },
    write (device, array, callback) {
      this.printCharacteristic
        .writeValue(array)
        .then(() => {
          console.log('Printed Array: ' + array.length)
          setTimeout(() => {
            if (callback) {
              callback()
            }
          }, 250)
        })
        .catch(error => {
          this.handleError(error, device)
        })
    }
  }
}
</script>
