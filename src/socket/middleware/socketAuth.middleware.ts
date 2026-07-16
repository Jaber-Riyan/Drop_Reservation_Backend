import { Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types';

/**
 * Socket.IO authentication middleware.
 *
 * This middleware runs before any connection handler.
 * It validates that the client provided a userId in the handshake auth.
 *
 * Frontend connection example:
 *   io(API_URL, { auth: { userId: 5 } })
 *
 * If userId is missing, the connection is rejected.
 * If valid, userId is attached to socket.data for later use.
 */
export function socketAuth(socket: Socket, next: (err?: Error) => void): void {
  // Check both auth object and query parameters for userId
  const userId = socket.handshake.auth?.userId ?? socket.handshake.query?.userId;

  // Validate that userId exists
  if (!userId) {
    console.error('Socket connection rejected: missing userId');
    return next(new Error('Authentication error: userId is required'));
  }

  // Attach userId to socket.data so handlers can access it
  const authenticatedSocket = socket as AuthenticatedSocket;
  authenticatedSocket.data.userId = Number(userId) || userId;

  next();
}
