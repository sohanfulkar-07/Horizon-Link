import dgram from 'dgram';

export class UDPServer {
  private socket: dgram.Socket;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.socket = dgram.createSocket('udp4');
  }

  start() {
    this.socket.bind(() => {
      this.socket.setBroadcast(true);
      console.log(`UDP Server started for broadcasting on port ${this.port}`);
    });
  }

  broadcast(message: string) {
    const buffer = Buffer.from(message);
    this.socket.send(buffer, 0, buffer.length, this.port, '255.255.255.255', (err) => {
      if (err) console.error('Broadcast error:', err);
    });
  }

  stop() {
    this.socket.close();
  }
}
