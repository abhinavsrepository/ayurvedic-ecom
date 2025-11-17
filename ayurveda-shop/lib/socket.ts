// Socket stub - Real-time notifications not yet implemented
// In the future, this should connect to a WebSocket server

type EventCallback = (data: any) => void;

class SocketStub {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect() {
    this.listeners.clear();
  }
}

let socketInstance: SocketStub | null = null;

export function getSocket(): SocketStub {
  if (!socketInstance) {
    socketInstance = new SocketStub();
  }
  return socketInstance;
}
