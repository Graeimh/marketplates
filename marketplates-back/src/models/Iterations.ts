import mongoose, { Schema } from 'mongoose';
import { CurrencyType, IImageData, IIteration, ProductVolumes } from '../types.js';

const IterationsSchema = new mongoose.Schema<IIteration>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    images: [new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    })],
    name: { type: String, required: true },
    opinionIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    placeIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    productId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    price: [{
      currency: { type: CurrencyType, required: true, default: CurrencyType.Euro },
      monetaryCost: { type: Number, required: true },
      volumeObtained: [{ type: ProductVolumes, required: true }]
    }],
    specificDescription: { type: String, required: true },
    tagIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  },
  { versionKey: false }
);

const collectionName = 'Iterations'
const IterationsModel = mongoose.model('Iterations', IterationsSchema, collectionName)

export default IterationsModel