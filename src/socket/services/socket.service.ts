import { Server } from 'socket.io';
import { EVENTS, type AppSocketEventName } from '../events';
import type {
  StockUpdatedPayload,
  ReservationCreatedPayload,
  ReservationExpiredPayload,
  ReservationFailedPayload,
  PurchaseCompletedPayload,
  PurchaseFailedPayload,
  ActivityUpdatedPayload,
} from '../types';

/**
 * SocketService - provides a centralized way to emit Socket.IO events.
 *
 * This service abstracts direct io.emit() calls from the rest of the application.
 * Future modules (Reservation, Purchase, Cron) will use this service
 * instead of calling io directly.
 *
 * Benefits:
 * - Single responsibility for socket communication
 * - Easy to test and mock
 * - Easy to extend with new methods
 * - No direct io.emit() scattered across the codebase
 *
 * All event names are typed via AppSocketEventName, so only events defined
 * in src/socket/events.ts can be emitted at compile time.
 */
class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Emit an event to a specific user.
   *
   * Uses Socket.IO rooms - all sockets in the user's room will receive the event.
   * This supports multiple tabs, windows, and devices automatically.
   *
   * @param userId - The user ID to send to
   * @param event - The event name (use constants from EVENTS)
   * @param payload - The typed payload to send
   */
  toUser<T>(
    userId: number,
    event: AppSocketEventName,
    payload: T,
  ): void {
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  /**
   * Emit an event to all connected clients.
   *
   * @param event - The event name (use constants from EVENTS)
   * @param payload - The typed payload to send
   */
  broadcast<T>(
    event: AppSocketEventName,
    payload: T,
  ): void {
    this.io.emit(event, payload);
  }

  /**
   * Emit an event to a specific room.
   *
   * @param room - The room name
   * @param event - The event name (use constants from EVENTS)
   * @param payload - The typed payload to send
   */
  toRoom<T>(
    room: string,
    event: AppSocketEventName,
    payload: T,
  ): void {
    this.io.to(room).emit(event, payload);
  }
}

export default SocketService;