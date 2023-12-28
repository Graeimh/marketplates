import mongoose, { Schema } from 'mongoose';
import { ITag, ITagAffinity } from '../common/types/tagTypes.js';

// Defining a schema matching the interface ITag
const TagsSchema = new mongoose.Schema<ITag>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    backgroundColor: { type: String, required: true },
    creationDate: { type: Date, default: Date.now() },
    creatorId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    isOfficial: { type: Boolean, required: true },
    name: { type: String, required: true },
    nameColor: { type: String, required: true },
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

const collectionName = 'Tags';

// Creating a model for database interactions
const TagsModel = mongoose.model('Tags', TagsSchema, collectionName);

export default TagsModel