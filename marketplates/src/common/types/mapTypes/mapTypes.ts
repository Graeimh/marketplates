import { IPlaceUpdated } from "../placeTypes/placeTypes";

/**
 * Contains the privacy settings for maps
 *
 * @member Private means the content can only be accessed by its owner
 * @member Protected means the content can be accessed by users authorized by the owner
 * @member Public means the content can be accessed by any user
 */

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
}

/**
 * Defines the privileges for users when interacting with a map
 *
 * @member Editer means the user can view the map and edit its custom markers
 * @member Owner means the user can view, edit and delete any of the map's contents or the map itself
 * @member Viewer means the user can view the map's contents
 */

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}

/**
 * Defines the values necessary to create a map in the database
 *
 * @interface IMaps
 * 
 * @member {string | undefined} _id is used for calling upon the map when needed
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits or give user data on the map's age
 * @member {string} description allows the user to describe the purpose of their map
 * @member {string} name allows the user to name their map
 * @member {string} ownerId is used to identify which user owns the map
 * @member {IParticipants[]} participants is used to distribute user privileges over the map
 * @member {string[]} placeIterationIds is to pull data for custom map markers already created
 * @member {PrivacyStatus} privacyStatus is used to set how accessible the map is to all users
 */

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

/**
 * Defines the values created by user inputs for a map
 *
 * @interface IMapValues
 * 
 * @member {string} description allows the user to describe the purpose of their map
 * @member {string} name allows the user to name their map
 * @member {IParticipants[]} participants is used to distribute user privileges over the map
 * @member {IPlaceUpdated[]} placeIterations is the data for custom map markers
 * @member {PrivacyStatus} privacyStatus is used to set how accessible the map is to all users
 */

export interface IMapValues {
    description: string;
    name: string;
    participants: IParticipants[];
    placeIterations: IPlaceUpdated[];
    privacyStatus: PrivacyStatus;
}

/**
 * Associates a user with their privileges over a map
 *
 * @interface IParticipants
 * 
 * @member {Types.ObjectId} userId is used to identify which user will have which privileges
 * @member {UserPrivileges[]} userPrivileges is used to give a user its privileges, it could be that they have several, hence the array
 */

export interface IParticipants {
    userId: string;
    userPrivileges: UserPrivileges[];
}

