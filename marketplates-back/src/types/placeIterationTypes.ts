import { Types } from "mongoose";

import { IGPSCoordinates } from "./commonTypes.js";

export interface IPlaceIteration {
    _id?: Types.ObjectId;
    associatedMapIds: Types.ObjectId[];
    creationDate?: Date;
    creatorId: Types.ObjectId;
    customName: string;
    customDescription: string;
    customTagIds: Types.ObjectId[];
    gpsCoordinates: IGPSCoordinates;
    placeId: Types.ObjectId;
};