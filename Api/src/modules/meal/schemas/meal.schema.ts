import mongoose, { Schema, Document } from 'mongoose';

export interface IMeal extends Document {
  _id: string;
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  tags: string[];
  isAvailable: boolean;
  preparationTime: number; // in minutes
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  allergens?: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: 0 | 1 | 2 | 3 | 4 | 5; // 0 = not spicy, 5 = very spicy
  rating: {
    average: number;
    count: number;
  };
  soldCount: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mealSchema = new Schema<IMeal>({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0.01,
    max: 1000
  },
  image: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
    default: 15
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  allergens: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isVegetarian: {
    type: Boolean,
    default: false,
    index: true
  },
  isVegan: {
    type: Boolean,
    default: false,
    index: true
  },
  isGlutenFree: {
    type: Boolean,
    default: false,
    index: true
  },
  spicyLevel: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Compound indexes for efficient queries
mealSchema.index({ restaurantId: 1, isAvailable: 1, isDeleted: 1 });
mealSchema.index({ category: 1, isAvailable: 1 });
mealSchema.index({ tags: 1, isAvailable: 1 });
mealSchema.index({ isVegetarian: 1, isVegan: 1, isGlutenFree: 1 });
mealSchema.index({ 'rating.average': -1, soldCount: -1 });

// Text search index
mealSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  ingredients: 'text'
});

export const Meal = mongoose.model<IMeal>('Meal', mealSchema);
export default Meal;
