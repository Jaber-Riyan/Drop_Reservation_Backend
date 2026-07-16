import ActivityRepository from './activity.repository';
import { IActivityFeedItem } from './activity.interface';

/**
 * ActivityService - contains business logic for the activity feed.
 *
 * The activity feed represents the latest completed purchases.
 * No separate Activity table exists; the Purchase table is the source of truth.
 *
 * This layer:
 * - Coordinates the repository for data access
 * - Contains the limit/default logic
 * - Does NOT know anything about Express (no req/res)
 * - Can be tested independently of the HTTP layer
 */
class ActivityService {
  private activityRepository: ActivityRepository;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  /**
   * Get the latest activity feed items.
   *
   * @param limit - Maximum number of items to return (default: 3)
   * @returns Array of activity feed items sorted by purchase date descending
   */
  async getLatestActivity(limit = 3): Promise<IActivityFeedItem[]> {
    return this.activityRepository.findLatest(limit);
  }
}

export default ActivityService;
