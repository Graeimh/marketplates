import { IGPSCoordinates } from "../commonTypes.ts/commonTypes";
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

export interface ITagFilterQuery {
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

export interface IPlaceRegisterValues {
    name: string;
    description: string;
    address: string;
    gpsCoordinates: IGPSCoordinates
    tagList: ITag[];
}