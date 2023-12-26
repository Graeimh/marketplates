import { Types } from "mongoose";
import { IGPSCoordinates } from "./commonTypes.js";
import { ITag } from "./tagTypes.js";

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
};

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
};

export interface IMaps {
    _id?: Types.ObjectId;
    creationDate?: Date;
    description: string
    name: string
    ownerId: Types.ObjectId;
    participants: IParticipants[];
    placeIterationIds: Types.ObjectId[];
    privacyStatus: PrivacyStatus;
};

export interface IParticipants {
    userId: Types.ObjectId;
    userPrivileges: UserPrivileges[];
}

export interface IPlaceUpdated {
    _id?: Types.ObjectId;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    name: string;
    tagsIdList: Types.ObjectId[];
    tagsList: ITag[];
}