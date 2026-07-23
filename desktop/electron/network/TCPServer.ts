import net from 'net';
import { EventEmitter } from 'events';

export class TCPServer extends EventEmitter {
  private server: net.Server;
  private port: number;

  constructor(port: number) {
    super();
    this.port = port;
    this.server = net.createServer((socket) => {
      this.handleConnection(socket);
    });
  }

  start() {
    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`TCP Server listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close();
  }

  private handleConnection(socket: net.Socket) {
    console.log(`New TCP connection from ${socket.remoteAddress}:${socket.remotePort}`);
    this.emit('connection', socket);

    socket.on('data', (data) => {
      this.emit('data', socket, data);
    });

    socket.on('close', () => {
      console.log(`TCP connection closed: ${socket.remoteAddress}`);
      this.emit('close', socket);
    });

    socket.on('error', (err) => {
      console.error(`TCP error:`, err);
      this.emit('error', socket, err);
    });
  }
}
