const fs = require('fs'),
    path = require('path'),
    Avrgirl = require('avrgirl-arduino'),
    SerialPort = require("serialport"),
    Electron = require('electron'),
    openURL = require("open")

const RUBENDAX_URL = 'https://rubendax.com',
    RUBENDAX_URL_FIRMWARE = 'https://storage.googleapis.com/rubendax.com/firmware/',
    RUBENDAX_URL_FIRMWARE_INFO = 'https://storage.googleapis.com/rubendax.com/firmware/info.json'

const VENDOR_ID = '2341',
    PRODUCT_ID = '8036'

function openWebsite() {
    openURL(RUBENDAX_URL)
}

function programAVR(port, hexPath) {
    return new Promise(resolve => {
        var avrgirl = new Avrgirl({
            board: 'leonardo',
            // port: port
        })
        
        avrgirl.flash(hexPath, error => {
            if (error)
                resolve(error)
            else
                resolve('Success')
        })
    })
}

async function getPortList() {
    const ports = await SerialPort.list()
    let portList = []
    for (let p of ports)
        if (p.vendorId == VENDOR_ID && p.productId == PRODUCT_ID)
            portList.push(p.path)
    return portList
}

async function _getLatestFirmwareURL() {
    let filepath = await _downloadFile(RUBENDAX_URL_FIRMWARE_INFO, 'rubendax-versions.json')
    if (filepath == null)
        return null

        let info = await _fileToJson(filepath)
    let latest = info.versions.latest
    return { url: RUBENDAX_URL_FIRMWARE + info.versions[latest], version: latest }
}

function _fileToJson(filepath) {
    return new Promise(resolve => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err)
              resolve(null)
            resolve(JSON.parse(data))
        })
    })
}

async function getDownloadedFirmwarePath() {
    let urlVersion = await _getLatestFirmwareURL(),
        url = urlVersion.url,
        version = urlVersion.version
    let hexPath = await _downloadFile(url, 'rubendax-latest.hex')
    if (hexPath == null)
        return null

    return { path: hexPath, url: url, version: version }
}

async function _downloadFile(url, filename) {
    let app = Electron.remote.app
    let filePath = path.join(app.getPath('temp'), filename)
    let blob = await fetch(url).then(r => r.blob())
    if (blob.type == 'application/xml')
        return null

        let base64 = await blobToBase64(blob)
    let buffer = new Buffer(base64, 'base64')
    await fs.writeFile(filePath, buffer, error => {})
    return filePath
}

function blobToBase64(blob) {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result
            var base64 = dataUrl.split(',')[1]
            resolve(base64)
        };
        reader.readAsDataURL(blob)
    })
}

exports.programAVR = programAVR
exports.getPortList = getPortList
exports.getDownloadedFirmwarePath = getDownloadedFirmwarePath
