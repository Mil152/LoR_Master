// const electron = require('electron')
// const app = electron.app
// const BrowserWindow = electron.BrowserWindow

// let url
// if (!process.env.NODE_ENV === 'production') {
//   url = 'http://localhost:8080/'
// } else {
//   url = `file://${process.cwd()}/dist/index.html`
// }

// app.on('ready', () => {
//   let window = new BrowserWindow({width: 800, height: 600})
//   window.loadURL(url)
// })


const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

const server = require('./appsrc/server.js')
server.run

// const client = require('./appsrc/client.js')

const zmq = require("zeromq")

// async function runClient() {
//     const sock = new zmq.Subscriber
  
//     sock.connect("tcp://127.0.0.1:3000")
//     sock.subscribe("kitty cats")
//     console.log("Subscriber connected to port 3000")
  
//     for await (const [topic, msg] of sock) {
//       console.log("received a message related to:", topic.toString(), "containing message:", msg.toString())
//       mainWindow.clientData = "CATAT"
//       // console.log(mainWindow)
//     }
// }

let mainWindow = null
const createWindow = () => {


  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  let factor = electron.screen.getPrimaryDisplay().scaleFactor
  // console.log(width)
  let windowWidth = 360
  // let window.windowWidth = windowWidth
  let windowHeight = Math.floor(windowWidth*1.666)

  let developmentMode = false

  if (developmentMode) {
    windowWidth = 360 + 400
  }


  mainWindow = new BrowserWindow({
    maxWidth: windowWidth,
    minWidth: windowWidth,
    width: windowWidth, 
    height: windowHeight, 
    x: width - windowWidth,
    y: height - windowHeight,
    frame: false,
    webPreferences: {
      preload: __dirname + '/appsrc/preload.js',
      enableRemoteModule: true,
      // nodeIntegration: true,
      nodeIntegrationInWorker: true,
    }
    // titleBarStyle: 'hiddenInset'
  })
  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // console.log("Is development?", process.env.NODE_ENV === 'development')
  
  mainWindow.removeMenu()
  mainWindow.setAlwaysOnTop(true, level = "pop-up-menu")
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (developmentMode) mainWindow.webContents.openDevTools()
  
  mainWindow.webContents.on('new-window', function (evt, url, frameName, disposition, options, additionalFeatures) {
    if(options.width == 800 && options.height == 600){ //default size is 800x600
        
        options.width = windowWidth | 0;
        options.height = windowHeight | 0;
        
        options.x = 1440 - windowWidth * 2;
        // console.log(width);
        options.y = height - windowHeight;
        // options.titleBarStyle = 'hidden'
        options.frame = true;
    }
  });

  // const worker = new Worker(__dirname + '/electron/server.js')
  // server.run
  // runClient()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// console.log("Activated Electron");