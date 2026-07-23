import { BrowserWindow } from 'electron';

export interface DeviceInfo {
  id: string;
  ip: string;
  status: 'connected' | 'disconnected';
  name?: string;
}

export class DeviceManager {
  private devices: Map<string, DeviceInfo> = new Map();
  private window: BrowserWindow | null = null;

  setWindow(window: BrowserWindow) {
    this.window = window;
    // Send initial state when window is set
    this.notifyWindow();
  }

  addDevice(device: DeviceInfo) {
    this.devices.set(device.id, device);
    this.notifyWindow();
  }

  updateDeviceStatus(id: string, status: 'connected' | 'disconnected') {
    const device = this.devices.get(id);
    if (device) {
      device.status = status;
      this.notifyWindow();
    }
  }

  removeDevice(id: string) {
    this.devices.delete(id);
    this.notifyWindow();
  }

  getDevices() {
    return Array.from(this.devices.values());
  }

  private notifyWindow() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('devices-updated', this.getDevices());
    }
  }
}
