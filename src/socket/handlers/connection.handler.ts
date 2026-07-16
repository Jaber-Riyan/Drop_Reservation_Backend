import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { EVENTS } from '../events';

/**
 * Connection handler - called when a new socket connects.
 *
 * Responsibilities:
 * - Join the user to their personal room (user:{userId})
 * - Log the connection details
 *
 * This handler is registered in socket.ts and called automatically
 * by Socket.IO when a client connects.
 */
export function handleConnection(io: Server, socket: AuthenticatedSocket): void {
  const userId = socket.data.userId;
  const roomName = `user:${userId}`;

  // Join the user's personal room
  socket.join(roomName);

  // Log connection details
  console.log(`User ${userId} connected`);
  console.log(`Socket ID: ${socket.id}`);
  console.log(`Joined room: ${roomName}`);
}