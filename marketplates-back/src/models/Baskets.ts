import mongoose, { Schema } from 'mongoose';
import { IShoppingListItem, IBasket } from '../types.js';

const BasketsSchema = new mongoose.Schema<IBasket>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    content: [new Schema<IShoppingListItem>({
      iterationId: { type: mongoose.SchemaTypes.ObjectId, required: true },
      quantity: { type: Number, required: true },
    })],
    creationDate: { type: Date, default: Date.now() },
    name: { type: String, required: true },
    orginalOwnerId: { type: String, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Baskets'
const BasketsModel = mongoose.model('Baskets', BasketsSchema, collectionName)

export default BasketsModel