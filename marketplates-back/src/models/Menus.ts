import mongoose from 'mongoose';
import { CurrencyType, IMenu } from '../types.js';

const MenusSchema = new mongoose.Schema<IMenu>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    description: { type: String, required: true },
    name: { type: String, required: true },
    owner_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    sectionIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    price: {
      currency: { type: String, enum: CurrencyType, required: true, default: CurrencyType.Euro },
      monetaryCost: { type: Number, required: true },
    },
  },
  { versionKey: false }
)

const collectionName = 'Places'
const MenusModel = mongoose.model('Places', MenusSchema, collectionName)

export default MenusModel