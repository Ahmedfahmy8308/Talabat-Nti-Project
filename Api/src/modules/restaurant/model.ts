import mongoose, { Document, Schema } from 'mongoose';

export interface IMeal extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients: string[];
  isAvailable: boolean;
  restaurantId: string;
  preparationTime: number; // in minutes
  calories?: number;
  allergens: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const mealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
      maxlength: [100, 'Meal name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Meal description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['appetizer', 'main', 'dessert', 'beverage', 'salad', 'soup', 'side'],
        message: 'Category must be one of: appetizer, main, dessert, beverage, salad, soup, side'
      }
    },
    image: {
      type: String,
      trim: true
    },
    ingredients: [{
      type: String,
      trim: true
    }],
    isAvailable: {
      type: Boolean,
      default: true
    },
    restaurantId: {
      type: String,
      required: [true, 'Restaurant ID is required'],
      ref: 'User'
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [1, 'Preparation time must be at least 1 minute']
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative']
    },
    allergens: [{
      type: String,
      enum: ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish'],
      trim: true
    }],
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better performance
mealSchema.index({ restaurantId: 1 });
mealSchema.index({ category: 1 });
mealSchema.index({ isAvailable: 1 });
mealSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IMeal>('Meal', mealSchema);
