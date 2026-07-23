import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { BroadcastService } from './services/BroadcastService'
import { ConnectionManager } from './services/ConnectionManager'
import { DeviceManager } from './services/DeviceManager'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

// Initialize Services
const UDP_PORT = 47777;
const TCP_PORT = 47778;

const deviceManager = new DeviceManager();
const connectionManager = new ConnectionManager(TCP_PORT);
const broadcastService = new BroadcastService(UDP_PORT, TCP_PORT);

// Hook up events
connectionManager.on('device-connected', (info) => {
  deviceManager.addDevice({ id: info.id, ip: info.ip, status: 'connected', name: `Device (${info.ip})` });
});

connectionManager.on('device-disconnected', (info) => {
  deviceManager.removeDevice(info.id);
});

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Frameless for custom titlebar
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    deviceManager.setWindow(win!);
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// IPC Handlers for custom title bar
ipcMain.on('window-minimize', () => {
  if (win) win.minimize();
});

ipcMain.on('window-maximize', () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (win) win.close();
});

// IPC Handlers for Devices
ipcMain.handle('get-devices', () => {
  return deviceManager.getDevices();
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    broadcastService.stop();
    connectionManager.stop();
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();
  broadcastService.start();
  connectionManager.start();
})
