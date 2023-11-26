import mongoose, { Schema, model } from 'mongoose';
import { IImageData, IAppliances } from '../types.js';


const AppliancesSchema = new Schema<IAppliances>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    applianceName: { type: String, required: true },
    picture: new Schema<IImageData>({
      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    }),
  },
  { versionKey: false }
);

/*
creationDate: { type: Date, default: Date.now },
description: { type: String, required: true, default: "" }
picture: new Schema<IImageData>({
      imageURL: { type: String, required: true, default: "" },
      imageCaption: { type: String, required: true, default: "" },
    }),
title: { type: String, required: true, default: "" }
type:
whistleblower: {
  isFromSystem:
  user: {
    isFromUser:
    userId:    
  }
}
*/

const collectionName = 'Appliances'
const AppliancesModel = model<IAppliances>('Appliances', AppliancesSchema, collectionName)

export default AppliancesModel