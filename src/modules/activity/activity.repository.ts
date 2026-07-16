import BaseRepository from '../../repositories/BaseRepository';
import Purchase from '../purchase/purchase.model';
import User from '../user/user.model';
import Drop from '../drop/drop.model';
import { IActivityFeedItem } from './activity.interface';

/**
 * ActivityRepository - handles database queries for the activity feed.
 *
 * The activity feed is simply the latest purchases with joined user and drop
 * details. No separate Activity table exists.
 *
 * This layer ONLY performs database operations. No business logic.
 */
class ActivityRepository extends BaseRepository<Purchase> {
  constructor() {
    super(Purchase);
  }

  /**
   * Find the latest N completed purchases with user and drop details.
   *
   * Uses Sequelize associations to join Purchase → User and Purchase → Drop
   * in a single query, then maps the result to the activity feed shape.
   */
  async findLatest(limit: number): Promise<IActivityFeedItem[]> {
    const purchases = await Purchase.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
        {
          model: Drop,
          as: 'drop',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });

    return purchases.map((purchase) => {
      const user = (purchase as any).user as { username: string } | undefined;
      const drop = (purchase as any).drop as { name: string } | undefined;

      return {
        purchaseId: purchase.id,
        username: user?.username ?? '',
        dropId: purchase.dropId,
        dropName: drop?.name ?? '',
        purchasedAt: purchase.createdAt,
      };
    });
  }
}

export default ActivityRepository;
