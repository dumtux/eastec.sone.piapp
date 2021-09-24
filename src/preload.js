const lib = require('./lib.js')
const programAVR = lib.programAVR,
    getPortList = lib.getPortList,
    getDownloadedFirmwarePath = lib.getDownloadedFirmwarePath


window.addEventListener('DOMContentLoaded', () => {
        async function init() {
        const BUFFER = {
            port: null,
            hex: null
        }

        const version = document.getElementById('version'),
            versionContainer = document.getElementById('version-container'),
            portSelector = document.getElementById('port-selector'),
            portSelectorContainer = document.getElementById('port-selector-container'),
            searchAgainButton = document.getElementById('search-again-button'),
            searchAgainButtonContainer = document.getElementById('search-again-button-container'),
            hexFileContainer = document.getElementById('hex-file-container'),
            hexFilePicker = document.getElementById('hex-file-input'),
            hexFileName = document.getElementById('hex-file-name'),
            uploadButton = document.getElementById('upload-button'),
            uploadButtonContainer = document.getElementById('upload-button-container'),
            progressContainer = document.getElementById('progress-container'),
            messageContainer = document.getElementById('message-container'),
            message = document.getElementById('message')

        log('Getting latest firmware ...')
        progressContainer.style.visibility = 'visible'
        let latestFirmwarePath = await getDownloadedFirmwarePath()
        await delay(800)

        if (latestFirmwarePath == null) {
            log('Getting latest firmware ... Error while downloading firmware HEX file. Please check your network connection.')
            versionContainer.style.visibility = 'hidden'
            return
        } else {
            version.textContent = 'Latest firmware V ' + latestFirmwarePath.version + ' from ' + latestFirmwarePath.url
            versionContainer.style.visibility = 'visible'
        }
        BUFFER.hex = latestFirmwarePath.path
        progressContainer.style.visibility = 'hidden'
        log('Getting latest firmware ... Success')

        await delay(1200)

        async function showPortList() {
            log('Searching devices ...')
            progressContainer.style.visibility = 'visible'
            // portSelectorContainer.style.visibility = 'hidden'
            searchAgainButtonContainer.style.visibility = 'hidden'
            uploadButtonContainer.style.visibility = 'hidden'

            const portList = await getPortList()
            // portListHtml = '<option style="display: none;" value="" disabled selected>Select COM port</option>'
            // for (let p of portList) {
            //     portListHtml += '<option value="PORT_PATH">PORT_NAME</option>'.replace('PORT_PATH', p).replace('PORT_NAME', p)
            // }
            // // portListHtml += '<option value="/dev/ttyACM0">/dev/ttyACM0 (only for ProMicro on Linux)</option>'
            // portSelector.innerHTML = portListHtml

            await delay(800)
            // progressContainer.style.visibility = 'hidden'

            if (portList.length == 0) {
                log('Searching devices ... No compitible device found. Connect the device to USB and press "Search Again" button.')
                uploadButtonContainer.style.visibility = 'hidden'
            } else if (portList.length > 1) {
                log('Searching devices ... ' + portList.length + ' devices found. Please connect only 1 device and try again.')
                uploadButtonContainer.style.visibility = 'hidden'
            } else {
                log('Searching devices ... ' + 'Success')
                BUFFER.port = portList[0]
                uploadButtonContainer.style.visibility = 'visible'
            }
            searchAgainButtonContainer.style.visibility = 'visible'
            progressContainer.style.visibility = 'hidden'
        }
        searchAgainButton.onclick = showPortList
        await showPortList()

        // portSelector.onchange = async () => {
        //     progressContainer.style.visibility = 'visible'
        //     portSelectorContainer.style.visibility = 'hidden'
        //     searchAgainButtonContainer.style.visibility = 'hidden'
        //     uploadButtonContainer.style.visibility = 'hidden'

        //     BUFFER.port = portSelector.value
        //     await delay(800)

        //     // hexFileContainer.style.visibility = 'visible'
        //     progressContainer.style.visibility = 'hidden'
        //     portSelectorContainer.style.visibility = 'visible'
        //     searchAgainButtonContainer.style.visibility = 'visible'
        //     uploadButtonContainer.style.visibility = 'visible'
        //     log('Click "Upgrade Now" button to continue ...')
        // }

        // // pick hex file
        // hexFilePicker.onchange = () => {
        //     const hexFile = hexFilePicker.files[0]
        //     hexFileName.textContent = hexFile.name
        //     BUFFER.hex = hexFile.path

        //     uploadButtonContainer.style.visibility = 'visible'
        // }

        uploadButton.onclick = async () => {
            log('Upgrading firmware ...')
            progressContainer.style.visibility = 'visible'
            // portSelectorContainer.style.visibility = 'hidden'
            searchAgainButtonContainer.style.visibility = 'hidden'
            uploadButtonContainer.style.visibility = 'hidden'

            let result = await programAVR(BUFFER.port, BUFFER.hex)
            
            await delay(800)
            progressContainer.style.visibility = 'hidden'
            log('3. Upgrading firmware ... ' + result)

            // await delay(1800)
            // window.close()
        }

        function log(e) {
            messageContainer.style.visibility = 'visible'
            message.textContent = e
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }
    }

    init()
})
