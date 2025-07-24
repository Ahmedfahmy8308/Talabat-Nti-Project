import Meal, { IMeal } from './model';
import { AppError } from '../../middlewares/error.middleware';

export interface CreateMealData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients: string[];
  preparationTime: number;
  calories?: number;
  allergens?: string[];
  tags?: string[];
}

export interface UpdateMealData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  ingredients?: string[];
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
  tags?: string[];
}

export class RestaurantService {
  static async createMeal(restaurantId: string, mealData: CreateMealData): Promise<IMeal> {
    const meal = new Meal({
      ...mealData,
      restaurantId
    });

    await meal.save();
    return meal;
  }

  static async getMealsByRestaurant(
    restaurantId: string,
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Promise<{ meals: IMeal[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { restaurantId };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [meals, total] = await Promise.all([
      Meal.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Meal.countDocuments(query)
    ]);

    return { meals, total };
  }

  static async getMealById(mealId: string, restaurantId?: string): Promise<IMeal> {
    const query: any = { _id: mealId };
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const meal = await Meal.findOne(query);
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    return meal;
  }

  static async updateMeal(
    mealId: string,
    restaurantId: string,
    updateData: UpdateMealData
  ): Promise<IMeal> {
    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, restaurantId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!meal) {
      throw new AppError('Meal not found or you do not have permission to update it', 404);
    }

    return meal;
  }

  static async deleteMeal(mealId: string, restaurantId: string): Promise<void> {
    const meal = await Meal.findOneAndDelete({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found or you do not have permission to delete it', 404);
    }
  }

  static async toggleMealAvailability(mealId: string, restaurantId: string): Promise<IMeal> {
    const meal = await Meal.findOne({ _id: mealId, restaurantId });
    if (!meal) {
      throw new AppError('Meal not found', 404);
    }

    meal.isAvailable = !meal.isAvailable;
    await meal.save();

    return meal;
  }

  static async getMealsByCategory(category: string): Promise<IMeal[]> {
    return await Meal.find({ category, isAvailable: true })
      .sort({ createdAt: -1 });
  }

  static async searchMeals(
    searchQuery: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ meals: IMeal[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = {
      $text: { $search: searchQuery },
      isAvailable: true
    };

    const [meals, total] = await Promise.all([
      Meal.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit),
      Meal.countDocuments(query)
    ]);

    return { meals, total };
  }
}
