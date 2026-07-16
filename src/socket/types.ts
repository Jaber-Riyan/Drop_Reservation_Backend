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

// ============================================================
// PAYLOAD INTERFACES
// ============================================================

// --------------------------------------------------
// DROP
// --------------------------------------------------

/**
 * Payload for DROP.STOCK_UPDATED.
 *
 * Emitted as a Global Event whenever the available stock for a drop changes.
 */
export interface StockUpdatedPayload {
  dropId: number;
  stock: number;
}

// --------------------------------------------------
// RESERVATION
// --------------------------------------------------

/**
 * Payload for RESERVATION.CREATED.
 *
 * Emitted as a Private Event to the user who created the reservation.
 */
export interface ReservationCreatedPayload {
  reservationId: number;
  userId: number;
  dropId: number;
  expiresAt: string;
}

/**
 * Payload for RESERVATION.EXPIRED.
 *
 * Emitted as a Private Event to the user whose reservation timed out.
 */
export interface ReservationExpiredPayload {
  reservationId: number;
  dropId: number;
}

/**
 * Payload for RESERVATION.FAILED.
 *
 * Emitted as a Private Event to the user whose reservation attempt failed.
 */
export interface ReservationFailedPayload {
  dropId: number;
  reason: string;
}

// --------------------------------------------------
// PURCHASE
// --------------------------------------------------

/**
 * Payload for PURCHASE.COMPLETED.
 *
 * Emitted as a Private Event to the user who completed the purchase.
 */
export interface PurchaseCompletedPayload {
  purchaseId: number;
  dropId: number;
  userId: number;
  quantity: number;
  total: number;
}

/**
 * Payload for PURCHASE.FAILED.
 *
 * Emitted as a Private Event to the user whose purchase failed.
 */
export interface PurchaseFailedPayload {
  dropId: number;
  userId: number;
  reason: string;
}

// --------------------------------------------------
// ACTIVITY
// --------------------------------------------------

/**
 * Payload for ACTIVITY.UPDATED.
 *
 * Emitted as a Global Event whenever a new purchase is completed.
 * Contains all fields the frontend needs to render the activity item
 * immediately without making another API request.
 */
export interface ActivityUpdatedPayload {
  purchaseId: number;
  username: string;
  dropId: number;
  dropName: string;
  purchasedAt: string;
}