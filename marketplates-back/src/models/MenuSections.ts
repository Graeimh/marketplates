import mongoose, { Schema } from 'mongoose';
import { IMenuSections } from '../types.js';

const MenuSectionsSchema = new mongoose.Schema<IMenuSections>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    name: { type: String, required: true },
    menuItemIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  },
  { versionKey: false }
)

const collectionName = 'MenuSections'
const MenuSectionsModel = mongoose.model('MenuSections', MenuSectionsSchema, collectionName)

export default MenuSectionsModel