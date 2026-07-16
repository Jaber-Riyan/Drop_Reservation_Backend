import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { socketAuth } from './middleware/socketAuth.middleware';
import { handleConnection } from './handlers/connection.handler';
import { handleDisconnect } from './handlers/disconnect.handler';
import { EVENTS } from './events';
import SocketService from './services/socket.service';
import { AuthenticatedSocket } from './types';

/**
 * Socket.IO initialization and configuration.
 *
 * This module:
 * - Creates the Socket.IO server from the existing HTTP server
 * - Applies authentication middleware
 * - Registers connection and disconnect handlers
 * - Exports the io instance and socketService for use by other modules
 *
 * The Express app and HTTP server are created in server.ts.
 * Socket.IO is initialized here to keep concerns separated.
 */
export interface SocketInitializationResult {
  io: SocketIOServer;
  socketService: SocketService;
}

export function initializeSocket(server: HttpServer): SocketInitializationResult {
  // Create Socket.IO server attached to the existing HTTP server
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Configure this properly in production
      methods: ['GET', 'POST'],
    },
  });

  // Apply authentication middleware to all connections
  io.use(socketAuth);

  // Register connection handler
  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;

    // Call the connection handler
    handleConnection(io, authenticatedSocket);

    // Register disconnect handler for this specific socket
    socket.on(EVENTS.DISCONNECT, (reason: string) => {
      handleDisconnect(io, authenticatedSocket, reason);
    });
  });

  // Create the socket service for use by other modules
  const socketService = new SocketService(io);

  console.log('✓ Socket.IO initialized');

  return {
    io,
    socketService,
  };
}