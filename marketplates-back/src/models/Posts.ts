import mongoose, { Schema } from 'mongoose';
import { IImageData, IPost, ContentType } from '../types.js';

const PostsSchema = new mongoose.Schema<IPost>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    attachementPictures: [new Schema<IImageData>({

      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    })],
    creationDate: { type: Date, default: Date.now },
    emittingUserId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    contentType: { type: [String], enum: ContentType, required: true },
    textContent: { type: String, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Posts'
const PostsModel = mongoose.model('Posts', PostsSchema, collectionName)

export default PostsModel