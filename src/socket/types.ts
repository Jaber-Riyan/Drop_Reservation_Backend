import { Server, Socket } from 'socket.io';

/**
 * SocketData - custom data attached to each socket.
 *
 * This is stored in socket.data and persists for the lifetime of the connection.
 * We extend the default ServerData with our own userId field.
 */
export interface SocketData {
  userId: number;
}

/**
 * AuthenticatedSocket - a Socket instance that has passed authentication.
 *
 * TypeScript now knows that socket.data.userId exists and is a number.
 * Use this type in handlers and services instead of the raw Socket type.
 */
export type AuthenticatedSocket = Socket<SocketData>;