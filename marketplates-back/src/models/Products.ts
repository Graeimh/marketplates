import mongoose, { Schema } from 'mongoose';
import { IImageData, IProduct } from '../types.js';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    associatedRecipeIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    description: { type: String, required: true },
    iterationIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    name: { type: String, required: true },
    picture: new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" }
    }),
    pairingsProductIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    sources: { type: [String], required: true },
    tagIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  },
  { versionKey: false }
);

const collectionName = 'Products'
const ProductsModel = mongoose.model('Products', ProductSchema, collectionName)

export default ProductsModel