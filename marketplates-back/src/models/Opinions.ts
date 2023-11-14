import mongoose, { Schema } from 'mongoose';
import { IImageData, IOpinion } from '../types.js';

const OpinionsSchema = new mongoose.Schema<IOpinion>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    attachementPicture: new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    }),
    emittingUserId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    grade: { type: Number, required: true },
    opinion: { type: String, required: true },
    originId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Opinions'
const OpinionsModel = mongoose.model('Opinions', OpinionsSchema, collectionName)

export default OpinionsModel