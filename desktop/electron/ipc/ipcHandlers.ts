import { ipcMain, BrowserWindow } from 'electron';
import { DeviceManager } from '../discovery/DeviceManager';

export function setupIpcHandlers(deviceManager: DeviceManager, getWindow: () => BrowserWindow | null) {
  // IPC Handlers for custom title bar
  ipcMain.on('window-minimize', () => {
    const win = getWindow();
    if (win) win.minimize();
  });

  ipcMain.on('window-maximize', () => {
    const win = getWindow();
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    const win = getWindow();
    if (win) win.close();
  });

  // IPC Handlers for Devices
  ipcMain.handle('get-devices', () => {
    return deviceManager.getDevices();
  });
}
