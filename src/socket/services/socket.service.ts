import { Server } from 'socket.io';

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
   * @param event - The event name
   * @param data - The data to send
   */
  toUser(userId: number, event: string, data: unknown): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Broadcast an event to all connected clients.
   *
   * @param event - The event name
   * @param data - The data to send
   */
  broadcast(event: string, data: unknown): void {
    this.io.emit(event, data);
  }

  /**
   * Emit an event to a specific room.
   *
   * @param room - The room name
   * @param event - The event name
   * @param data - The data to send
   */
  toRoom(room: string, event: string, data: unknown): void {
    this.io.to(room).emit(event, data);
  }
}

export default SocketService;