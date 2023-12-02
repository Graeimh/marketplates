import mongoose, { Schema } from 'mongoose'
import { UserType, IUser, AddressType } from '../types.js';

const UsersSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    activeBasketlistIds: { type: [mongoose.SchemaTypes.ObjectId], required: false, default: [] },
    csrfSecret: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    csrfToken: { type: String, default: "" },
    csrfTokenKey: { type: String, default: "" },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { addressType: { type: [String], enum: AddressType, default: [] }, denomination: { type: String, default: "" }, },
    password: { type: String, required: true },
    profilePicture: {
      imageURL: { type: String, default: "" },
      imageCaption: { type: String, default: "" },
    },
    recipes: { favoriteRecipes: { type: [mongoose.SchemaTypes.ObjectId], default: [] }, customRecipes: { type: [mongoose.SchemaTypes.ObjectId], default: [] } },
    type: { type: [String], enum: UserType, required: true },
  },
  { versionKey: false }
);

const collectionName = 'Users'
const UsersModel = mongoose.model('Users', UsersSchema, collectionName)

export default UsersModel