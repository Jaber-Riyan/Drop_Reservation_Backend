/**
 * Activity feed item representing the shape returned to the frontend.
 *
 * The activity feed is derived from the Purchase table - no separate
 * Activity table exists. Each item represents a completed purchase.
 */
export interface IActivityFeedItem {
  purchaseId: number;
  username: string;
  dropId: number;
  dropName: string;
  purchasedAt: Date;
}
