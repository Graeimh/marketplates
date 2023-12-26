import { Types } from "mongoose";
import { IGPSCoordinates } from "./commonTypes.js";

export interface IPlace {
    _id?: Types.ObjectId;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id: Types.ObjectId;
    name: string;
    tagsList: Types.ObjectId[];
};