/**
 * Socket.IO event name constants.
 *
 * Centralizing event names prevents typos and makes refactoring easier.
 * All event names are namespaced using colon notation (e.g. "drop:stock_updated").
 *
 * Usage:
 *   import { EVENTS } from './events';
 *   socketService.broadcast(EVENTS.DROP.STOCK_UPDATED, payload);
 */

export const EVENTS = {
  /**
   * Socket.IO internal lifecycle events.
   *
   * These are the raw Socket.IO server/socket event names used during
   * initialization and connection management. Do NOT emit these manually.
   */
  SOCKET: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
  },

  /**
   * CONNECTION namespace — application-level connection events.
   *
   * CONNECTION.CONNECTED
   *   Global Event
   *   Purpose: Notify all connected dashboards that a user has come online.
   *
   * CONNECTION.DISCONNECTED
   *   Global Event
   *   Purpose: Notify all connected dashboards that a user has gone offline.
   */
  CONNECTION: {
    CONNECTED: 'connection:connected',
    DISCONNECTED: 'connection:disconnected',
  },

  /**
   * DROP namespace — drop / inventory events.
   *
   * DROP.STOCK_UPDATED
   *   Global Event
   *   Purpose: Push updated stock counts to every connected dashboard so
   *   all clients see the same available quantity in real time.
   */
  DROP: {
    STOCK_UPDATED: 'drop:stock_updated',
  },

  /**
   * RESERVATION namespace — reservation lifecycle events.
   *
   * RESERVATION.CREATED
   *   Private Event (targets a single user via user:{userId} room)
   *   Purpose: Confirm to the reserving user that their hold was created.
   *
   * RESERVATION.EXPIRED
   *   Private Event
   *   Purpose: Inform the user that their reservation timed out before checkout.
   *
   * RESERVATION.FAILED
   *   Private Event
   *   Purpose: Tell the user that the reservation attempt could not be fulfilled
   *   (e.g. insufficient stock, race condition).
   */
  RESERVATION: {
    CREATED: 'reservation:created',
    EXPIRED: 'reservation:expired',
    FAILED: 'reservation:failed',
  },

  /**
   * PURCHASE namespace — purchase lifecycle events.
   *
   * PURCHASE.COMPLETED
   *   Private Event
   *   Purpose: Confirm to the buyer that their purchase was finalized successfully.
   *
   * PURCHASE.FAILED
   *   Private Event
   *   Purpose: Inform the buyer that the purchase could not be completed
   *   (e.g. payment error, stock changed during checkout).
   */
  PURCHASE: {
    COMPLETED: 'purchase:completed',
    FAILED: 'purchase:failed',
  },

  /**
   * ACTIVITY namespace — activity feed events.
   *
   * ACTIVITY.UPDATED
   *   Global Event
   *   Purpose: Push a new activity entry to all connected dashboards so the
   *   activity feed stays in sync across every open tab.
   */
  ACTIVITY: {
    UPDATED: 'activity:updated',
  },
} as const;

/**
 * Infer all leaf event name string values from EVENTS.
 *
 * Use this as the type for the `event` parameter in SocketService methods
 * so that only valid, defined event names can be passed at compile time.
 */
export type AppSocketEventName = {
  [K in keyof typeof EVENTS]: typeof EVENTS[K] extends string
    ? never
    : typeof EVENTS[K] extends Record<string, string>
      ? typeof EVENTS[K][keyof typeof EVENTS[K]]
      : never;
}[keyof typeof EVENTS];

/**
 * Legacy alias kept for backward compatibility with existing imports.
 * @deprecated Use AppSocketEventName instead.
 */
export type SocketEvent = AppSocketEventName;