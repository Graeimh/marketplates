import mongoose, { Schema, model } from 'mongoose';
import { AnomalyType, IAnomalies } from '../types.js';


const AnomaliesSchema = new Schema<IAnomalies>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    anomalyType: { type: String, enum: AnomalyType, required: true },
    creationDate: { type: Date, default: Date.now() },
    culpritUserId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    joinedPictures: [{
      imageURL: { type: String, default: "" },
      imageCaption: { type: String, default: "" },
    },],
    originUserId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    textContent: { type: String },
    title: { type: String, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Anomalies'
const AnomaliesModel = model<IAnomalies>('Anomalies', AnomaliesSchema, collectionName)

export default AnomaliesModel