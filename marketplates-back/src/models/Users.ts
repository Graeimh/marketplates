import mongoose, { Schema } from 'mongoose'
import { UserType, IUser, IImageData, AddressType } from '../types.js';

const UsersSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    activeBasketlistIds: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { addressType: { type: [String], enum: AddressType, required: true }, denomination: { type: String, required: true }, },
    password: { type: String, required: true },
    profilePicture: new Schema<IImageData>({
      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    }),
    recipes: { favoriteRecipes: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] }, customRecipes: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] } },
    type: { type: [String], enum: UserType, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Users'
const UsersModel = mongoose.model('Users', UsersSchema, collectionName)

export default UsersModel