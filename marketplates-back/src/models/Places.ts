import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../types.js';

const PlacesSchema = new mongoose.Schema<IPlace>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    description: { type: String, required: true },
    gpsCoordinates: { type: String, required: true, default: "" },
    location: {
      streetAddress: { type: String, default: '' },
      county: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    name: { type: String, required: true },
    tagsList: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] },
  },
  { versionKey: false }
)

const collectionName = 'Places'
const PlacesModel = mongoose.model('Places', PlacesSchema, collectionName)

export default PlacesModel