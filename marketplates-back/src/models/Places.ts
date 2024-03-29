import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../common/types/placeTypes.js';

// Defining a schema matching the interface IPlace
const PlacesSchema = new mongoose.Schema<IPlace>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    address: { type: String, default: '' },
    creationDate: { type: Date, default: Date.now() },
    description: { type: String, default: '' },
    gpsCoordinates: {
      longitude: { type: Number, default: null },
      latitude: { type: Number, default: null },
    },
    owner_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: String, required: true },
    tagsList: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] },
  },
  { versionKey: false }
)

const collectionName = 'Places';

// Creating a model for database interactions
const PlacesModel = mongoose.model('Places', PlacesSchema, collectionName);

export default PlacesModel