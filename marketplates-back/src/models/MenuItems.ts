import mongoose from 'mongoose';
import { CurrencyType, IMenuItem } from '../types.js';

const MenuItemsSchema = new mongoose.Schema<IMenuItem>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    description: { type: String, required: true },
    name: { type: String, required: true },
    owner_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    price: {
      currency: { type: CurrencyType, required: true, default: CurrencyType.Euro },
      monetaryCost: { type: Number, required: true },
    },
    tagIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },

  },
  { versionKey: false }
)

const collectionName = 'MenuItems'
const MenuItemsModel = mongoose.model('MenuItems', MenuItemsSchema, collectionName)

export default MenuItemsModel