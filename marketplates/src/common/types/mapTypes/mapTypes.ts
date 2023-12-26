import { IPlaceUpdated } from "../placeTypes/placeTypes";

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
}

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}

export interface IMaps {
    _id?: string;
    creationDate?: Date;
    description: string
    name: string
    ownerId: string;
    participants: IParticipants[];
    placeIterationIds: string[];
    privacyStatus: PrivacyStatus;
}

export interface IMapValues {
    description: string;
    name: string;
    participants: IParticipant[];
    placeIterations: IPlaceUpdated[];
    privacyStatus: PrivacyStatus;
}

export interface IParticipant {
    userId: string,
    userPrivileges: UserPrivileges,
}

export interface IParticipants {
    userId: string;
    userPrivileges: UserPrivileges[];
}

