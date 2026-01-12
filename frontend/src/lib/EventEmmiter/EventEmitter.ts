export type EventCallback<T = any> = (data: T) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  subscribe(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  unsubscribe(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit<T = unknown>(event: string, data?: T): void {
    console.log(event, data);
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
