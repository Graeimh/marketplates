import { IGPSCoordinates, IPlaceUpdated } from "../placeTypes/placeTypes";
import { ITag } from "../tagTypes/tagTypes";

export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    country: string;
    city: string;
    county: string;
    streetAddress: string;
    password: string;
    passwordMatch: string;
}

export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    country: string;
    city: string;
    county: string;
    streetAddress: string;
    password: string;
    passwordMatch: string;
}

export interface IUserData {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    country: string;
    county: string;
    city: string;

}

export interface IPlaceRegisterValues {
    name: string;
    description: string;
    address: string;
    gpsCoordinates: IGPSCoordinates
    tagList: ITag[];
}

export interface ITagValues {
    backgroundColor: string;
    creatorId?: string;
    isOfficial?: boolean;
    nameColor: string;
    tagName: string;
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

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
}

export interface IPlaceValues {
    city: string;
    country: string;
    county: string;
    description: string;
    name: string;
    streetAddress: string;
}

export interface IPlaceIterationValues {
    mapId: string;
    userId: string;
    customName: string;
    customDescription: string;
}

export interface ILoginValues {
    email: string;
    password: string;
}

export interface IPasswordFitnessCriteria {
    isLengthCorrect: boolean;
    containsUppercase: boolean;
    containsLowerCase: boolean;
    containsNumbers: boolean;
    containsSpecialCharacter: boolean;
}


export interface IUser {
    _id: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    location: ILocation;
}

export interface ILocation {
    city: string
    country: string
    county: string
    streetAddress: string
}


export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
}