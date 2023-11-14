import mongoose, { Schema } from 'mongoose';
import { IRecipe, IImageData } from '../types.js';

const RecipesSchema = new mongoose.Schema<IRecipe>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    applianceIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    pictures: [new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    })],
    productIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    steps: { type: [String], required: true },
  },
  { versionKey: false }
);

const collectionName = 'Recipes'
const RecipesModel = mongoose.model('Recipes', RecipesSchema, collectionName)

export default RecipesModel