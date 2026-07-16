import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';

/**
 * Disconnect handler - called when a socket disconnects.
 *
 * Responsibilities:
 * - Log the disconnect event with socket ID and reason
 *
 * This handler is registered in socket.ts and called automatically
 * by Socket.IO when a client disconnects.
 */
export function handleDisconnect(io: Server, socket: AuthenticatedSocket, reason?: string): void {
  const userId = socket.data.userId;

  console.log(`User disconnected`);
  console.log(`Socket ID: ${socket.id}`);
  console.log(`Reason: ${reason || 'unknown'}`);
}
