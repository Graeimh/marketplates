import { ITag } from "../tagTypes/tagTypes";

export interface IPlace {
    _id?: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    name: string;
    tagsList: string[];
}

export interface IPlaceUpdated {
    _id?: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    place_id?: string;
    name: string;
    tagsIdList: string[];
    tagsList: ITag[];
}

export interface IPlaceFilterQuery {
    name: string;
    tagName: string;
    tags: ITag[];
}

export interface IMarkersForMap {
    _id?: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    name: string;
    tagsIdList: string[];
    tagsList: ITag[];
    isIteration: boolean;
}



export interface IPlaceData {
    _id?: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    name: string;
    tagsList: string[];
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
};

export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
}

export interface IParticipants {
    userId: string;
    userPrivileges: UserPrivileges[];
}

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}
