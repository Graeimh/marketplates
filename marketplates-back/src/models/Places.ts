import mongoose, { Schema } from 'mongoose';
import { AddressType, IAddressData, IPlace } from '../types.js';

const PlacesSchema = new mongoose.Schema<IPlace>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    address: {
      type: new Schema<IAddressData>({
        addressType: { type: [String], enum: AddressType, required: true },
        denomination: { type: String, required: true },
      }), required: true
    },
    description: { type: String, required: true },
    iterationIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    name: { type: String, required: true },
    placeOpinionIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
  },
  { versionKey: false }
)

const collectionName = 'Places'
const PlacesModel = mongoose.model('Places', PlacesSchema, collectionName)

export default PlacesModel