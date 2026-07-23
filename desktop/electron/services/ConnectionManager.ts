import net from 'net';
import { TCPServer } from './TCPServer';
import { EventEmitter } from 'events';

export class ConnectionManager extends EventEmitter {
  private tcpServer: TCPServer;
  private activeSockets: Map<string, net.Socket> = new Map();

  constructor(tcpPort: number) {
    super();
    this.tcpServer = new TCPServer(tcpPort);
    
    this.tcpServer.on('connection', (socket) => {
      const id = `${socket.remoteAddress}:${socket.remotePort}`;
      this.activeSockets.set(id, socket);
    });

    this.tcpServer.on('data', (socket, data) => {
      const id = `${socket.remoteAddress}:${socket.remotePort}`;
      const message = data.toString().trim();
      
      console.log(`Received from ${id}: ${message}`);
      
      // Simple Handshake
      if (message === 'CONNECTED') {
        socket.write('READY\n');
        this.emit('device-connected', { id, ip: socket.remoteAddress });
      }
    });

    this.tcpServer.on('close', (socket) => {
      const id = `${socket.remoteAddress}:${socket.remotePort}`;
      this.activeSockets.delete(id);
      this.emit('device-disconnected', { id });
    });
  }

  start() {
    this.tcpServer.start();
  }

  stop() {
    this.tcpServer.stop();
    for (const socket of this.activeSockets.values()) {
      socket.destroy();
    }
    this.activeSockets.clear();
  }
}
