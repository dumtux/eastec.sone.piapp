# Electron wrapper of AVRGIRL Arduino programmer

GUI frontend of [AVRGIRL](https://github.com/noopkat/avrgirl-arduino).

## Tested on

* Linux
  - Linux Mint 20
  - Node 10.19.0
* Mac
  - macOS 10.13.8 High Sierra
  - Node 10.15.4

## Quickstart

```sh
git clone https://github.com/hotteshen/avrgirl-arduino-electron
cd avrgirl-arduino-electron
npm install
npx electron-rebuild
npm start
```

## Build

```sh
npx electron-builder
```

Look inside of `dist/` directory.


## Patching Avrgirl for Mac

On MacOS, the serial port name sometimes changes during the upload process. To treat theis port name change, modify `node_modules/avrgirl-arduino/lib/connection.js` file after running `npm install`.

```javascript
...

Connection.prototype._pollForOpen = function(callback) {
  var _this = this;

  var poll = awty(function(next) {
    _this.serialPort.open(function(error) {
      // patching for bugfix on MacOS
      if (error && process.platform == 'darwin') {
        console.log("Some exeption raised on MacOS.");
        Serialport.list().then(ports => {
          for (var p of ports) {
            if (p.path.includes("/dev/tty.usbmodem")) {
              _this.options.port = p.path;
              break;
            }
          }
          console.log("Trying to open changed port at " + _this.options.port);
          _this.serialPort = new Serialport(_this.options.port, {
            baudRate: _this.board.baud,
            autoOpen: false
          });
        });
      }
      // end of patching
      next(!error);
    });
  });

  poll.every(200).ask(10);

  poll(function(isOpen) {
    var error;
    if (!isOpen) {
      error = new Error('could not open board on ' + _this.serialPort.path);
    }

    callback(error);
  });
};

...
```
