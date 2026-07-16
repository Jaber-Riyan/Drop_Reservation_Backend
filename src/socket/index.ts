/**
 * Socket module barrel file.
 *
 * Exports the socket initialization function, types, and utilities.
 * Import this file in server.ts to initialize Socket.IO.
 */
export { initializeSocket, type SocketInitializationResult } from './socket';
export { default as SocketService } from './services/socket.service';
export { socketAuth } from './middleware/socketAuth.middleware';
export { handleConnection } from './handlers/connection.handler';
export { handleDisconnect } from './handlers/disconnect.handler';
export { EVENTS, type SocketEvent } from './events';
export type { SocketData, AuthenticatedSocket, StockUpdatedPayload, ReservationCreatedPayload, ReservationExpiredPayload, ReservationFailedPayload, PurchaseCompletedPayload, PurchaseFailedPayload, ActivityUpdatedPayload } from './types';