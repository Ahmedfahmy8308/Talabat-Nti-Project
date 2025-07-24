import { Restaurant } from '../../user/schemas';
import Meal from '../../meal/schemas/meal.schema';
import { AppError } from '../../shared/middlewares/error.middleware';
import { Helpers } from '../../shared/utils/helpers';
import {
  CreateMealDTO,
  UpdateMealDTO,
  SearchMealsDTO,
} from '../dto/restaurant.dto';

export class RestaurantService {
  /**
   * Create a new meal
   */
  async createMeal(
    restaurantId: string,
    mealData: CreateMealDTO,
  ): Promise<any> {
    // Verify restaurant exists and is operational
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    if (restaurant.verificationStatus !== 'verified') {
      throw new AppError('Restaurant must be verified to add meals', 403);
    }

    const meal = new Meal({
      ...mealData,
      restaurantId,
    });

    await meal.save();

    // Add meal to restaurant's menu
    if (!restaurant.menu) {
      restaurant.menu = [];
    }
    restaurant.menu.push(meal._id);
    await restaurant.save();

    return meal;
  }

  /**
   * Update meal
   */
  async updateMeal(
    restaurantId: string,
    mealId: string,
    updateData: UpdateMealDTO,
  ): Promise<any> {
    const meal = await Meal.findOne({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    Object.assign(meal, updateData);
    await meal.save();

    return meal;
  }

  /**
   * Delete meal
   */
  async deleteMeal(restaurantId: string, mealId: string): Promise<void> {
    const meal = await Meal.findOneAndDelete({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    // Remove from restaurant's menu
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant && restaurant.menu) {
      restaurant.menu = restaurant.menu.filter(
        (id) => id.toString() !== mealId,
      );
      await restaurant.save();
    }
  }

  /**
   * Get restaurant's meals
   */
  async getRestaurantMeals(
    restaurantId: string,
    filters: any = {},
  ): Promise<any[]> {
    return await (Meal as any).findByRestaurant(restaurantId, filters);
  }

  /**
   * Search meals
   */
  async searchMeals(searchData: SearchMealsDTO): Promise<any> {
    const {
      search,
      category,
      maxPrice,
      minRating,
      isVegetarian,
      isVegan,
      isGlutenFree,
      restaurantId,
      page = 1,
      limit = 20,
    } = searchData;

    const query: any = { isAvailable: true };

    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    if (category) {
      query.category = category;
    }

    if (maxPrice) {
      query.price = { $lte: maxPrice };
    }

    if (minRating) {
      query['ratings.average'] = { $gte: minRating };
    }

    if (isVegetarian) {
      query.isVegetarian = true;
    }

    if (isVegan) {
      query.isVegan = true;
    }

    if (isGlutenFree) {
      query.isGlutenFree = true;
    }

    const { skip, limit: pageLimit } = Helpers.paginate(page, limit);

    let meals;
    if (search) {
      meals = await (Meal as any).searchMeals(search, query);
    } else {
      meals = await Meal.find(query)
        .populate('restaurantId', 'firstName lastName restaurantDetails.name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit);
    }

    const totalMeals = await Meal.countDocuments(query);
    const totalPages = Math.ceil(totalMeals / pageLimit);

    return {
      meals,
      totalMeals,
      totalPages,
      currentPage: page,
    };
  }

  /**
   * Get meal by ID
   */
  async getMealById(mealId: string): Promise<any> {
    const meal = await Meal.findById(mealId).populate(
      'restaurantId',
      'firstName lastName restaurantDetails.name ratings',
    );
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    return meal;
  }

  /**
   * Get meals by category
   */
  async getMealsByCategory(category: string): Promise<any[]> {
    return await Meal.find({
      category,
      isAvailable: true,
    })
      .populate('restaurantId', 'firstName lastName restaurantDetails.name')
      .sort({ 'ratings.average': -1 });
  }

  /**
   * Get featured meals
   */
  async getFeaturedMeals(limit: number = 10): Promise<any[]> {
    return await Meal.find({
      isAvailable: true,
      'ratings.average': { $gte: 4.0 },
    })
      .populate('restaurantId', 'firstName lastName restaurantDetails.name')
      .sort({ 'ratings.average': -1, 'ratings.count': -1 })
      .limit(limit);
  }

  /**
   * Toggle meal availability
   */
  async toggleMealAvailability(
    restaurantId: string,
    mealId: string,
  ): Promise<any> {
    const meal = await Meal.findOne({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    meal.isAvailable = !meal.isAvailable;
    await meal.save();

    return meal;
  }

  /**
   * Set meal discount
   */
  async setMealDiscount(
    restaurantId: string,
    mealId: string,
    discount: { percentage: number; validUntil: Date },
  ): Promise<any> {
    const meal = await Meal.findOne({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    meal.discount = discount;
    await meal.save();

    return meal;
  }

  /**
   * Remove meal discount
   */
  async removeMealDiscount(restaurantId: string, mealId: string): Promise<any> {
    const meal = await Meal.findOne({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    meal.discount = undefined;
    await meal.save();

    return meal;
  }

  /**
   * Get restaurant analytics
   */
  async getRestaurantAnalytics(
    restaurantId: string,
    dateRange?: { from: Date; to: Date },
  ): Promise<any> {
    const Order = require('../../order/schemas/order.schema').default;

    const matchStage: any = { restaurantId };
    if (dateRange) {
      matchStage.createdAt = { $gte: dateRange.from, $lte: dateRange.to };
    }

    const analytics = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    // Top selling meals
    const topMeals = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.mealId',
          name: { $first: '$items.name' },
          totalOrdered: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
    ]);

    return {
      ...(analytics[0] || {}),
      topMeals,
      dateRange,
    };
  }
}
