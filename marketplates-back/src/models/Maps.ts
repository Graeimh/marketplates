import mongoose, { Schema } from 'mongoose';
import { IMaps, PrivacyStatus, UserPrivileges } from '../common/types/mapTypes.js';

// Defining a schema matching the interface IMaps
const mapsSchema = new mongoose.Schema<IMaps>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    description: { type: String, required: true },
    name: { type: String, required: true },
    ownerId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    participants: [{
      userId: { type: [mongoose.SchemaTypes.ObjectId], required: true },
      userPrivileges: { type: [String], enum: UserPrivileges, required: true }
    }],
    placeIterationIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    privacyStatus: { type: String, enum: PrivacyStatus, default: PrivacyStatus.Private }
  },
  { versionKey: false }
)

const collectionName = 'Maps';

// Creating a model for database interactions
const MapsModel = mongoose.model('Maps', mapsSchema, collectionName);

export default MapsModel