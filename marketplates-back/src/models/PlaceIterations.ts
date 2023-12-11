import mongoose, { Schema } from 'mongoose';
import { IPlaceIteration } from '../types.js';

const PlaceIterationsSchema = new mongoose.Schema<IPlaceIteration>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    associatedMapIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    creationDate: { type: Date, default: Date.now() },
    creatorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    customName: { type: String, required: true },
    customDescription: { type: String, required: true },
    customTagIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    placeId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { versionKey: false }
)


const collectionName = 'PlaceIterations'
const PlaceIterationsModel = mongoose.model('PlaceIterations', PlaceIterationsSchema, collectionName)

export default PlaceIterationsModel