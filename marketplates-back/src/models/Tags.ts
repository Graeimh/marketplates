import mongoose, { Schema } from 'mongoose';
import { ITagAffinity, ITag, IImageData } from '../types.js';

const TagsSchema = new mongoose.Schema<ITag>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    color: { type: String, required: true },
    icon: new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    }),
    name: { type: String, required: true },
    tagAffinities: [new Schema<ITagAffinity>({
      affinity: { type: Number, required: true },
      tagId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
      },
    })],
  },
  { versionKey: false }
);

const collectionName = 'Tags'
const TagsModel = mongoose.model('Tags', TagsSchema, collectionName)

export default TagsModel