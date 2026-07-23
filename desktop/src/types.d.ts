export interface DeviceInfo {
  id: string;
  ip: string;
  status: 'connected' | 'disconnected';
  name?: string;
}

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      off: (channel: string, ...omit: any[]) => void;
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      
      minimize: () => void;
      maximize: () => void;
      close: () => void;

      getDevices: () => Promise<DeviceInfo[]>;
      onDevicesUpdated: (callback: (devices: DeviceInfo[]) => void) => void;
    }
  }
}
