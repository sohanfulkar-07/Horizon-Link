import os from 'os';
import { app } from 'electron';
import { UDPServer } from './UDPServer';

export class BroadcastService {
  private udpServer: UDPServer;
  private tcpPort: number;
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor(udpPort: number, tcpPort: number) {
    this.udpServer = new UDPServer(udpPort);
    this.tcpPort = tcpPort;
  }

  start() {
    this.udpServer.start();
    
    // Broadcast every 2 seconds
    this.intervalId = setInterval(() => {
      const payload = {
        hostName: os.hostname(),
        ipAddress: this.getLocalIpAddress(),
        version: app.getVersion(),
        tcpPort: this.tcpPort
      };
      this.udpServer.broadcast(JSON.stringify(payload));
    }, 2000);
    
    console.log('BroadcastService started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.udpServer.stop();
  }

  private getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
    return '127.0.0.1';
  }
}
