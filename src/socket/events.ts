/**
 * Socket.IO event name constants.
 *
 * Centralizing event names prevents typos and makes refactoring easier.
 * Add new event names here as the application grows.
 */

export const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
} as const;

/**
 * Infer the type from the EVENTS object.
 * This ensures type safety when using event names.
 */
export type SocketEvent = typeof EVENTS[keyof typeof EVENTS];