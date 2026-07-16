import { Request, Response, NextFunction } from 'express';
import ActivityService from './activity.service';
import { sendSuccess, sendError } from '../../utils/response';

/**
 * ActivityController - handles HTTP request/response for Activity endpoints.
 *
 * Responsibilities:
 * - Parse request parameters, body, and query strings
 * - Call the appropriate service method
 * - Return a formatted response using the response helpers
 * - Forward errors to the error middleware via next()
 *
 * This layer contains NO business logic.
 */
class ActivityController {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  /**
   * GET /activity/latest
   * Get the latest 3 completed purchases for the activity feed.
   */
  async getLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activities = await this.activityService.getLatestActivity(3);
      sendSuccess(res, 'Activity retrieved successfully', activities);
    } catch (error) {
      next(error);
    }
  }
}

export default ActivityController;
