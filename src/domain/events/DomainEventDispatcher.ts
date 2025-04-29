import { DomainEvent } from "./DomainEvent";

type DomainEventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void;

export class DomainEventDispatcher {
  private handlers: Map<string, DomainEventHandler<any>[]> = new Map();

  public register<T extends DomainEvent>(eventName: string, handler: DomainEventHandler<T>): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler]);
  }

  public async dispatch(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) || [];

    for (const handler of eventHandlers) {
      await handler(event);
    }
  }

  public async dispatchAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }
}
