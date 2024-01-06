import { IGPSCoordinates } from "../commonTypes.ts/commonTypes";
import { ITag } from "../tagTypes/tagTypes";

/**
 * Defines the values necessary to create a place in the database
 *
 * @interface IPlace
 * 
 * @member {string | undefined} _id is used for calling upon the place when needed
 * @member {string} address is used to allow users to find a path to the map marker
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} description is used by the owner to describe the place they are placing on the map
 * @member {IGPSCoordinates} gpsCoordinates is used to locate the place's marker on the map
 * @member {string | undefined} owner_id is used to identify which user owns the place
 * @member {string} name is used to name the place's marker on the map
 * @member {string[]} tagsList is used to gather tags by IDs to assign to the place's data
 */

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

/**
 * Contains a mix of pre existing place values and user inputs to create place iterations
 *
 * @interface IPlaceUpdated
 * 
 * @member {string | undefined} _id is used for calling upon the place iteration when needed
 * @member {string} address is used by the owner to describe the place they are placing on the map
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} description is used to give a custom description to the map marker
 * @member {IGPSCoordinates} gpsCoordinates is used to locate the place's marker on the map
 * @member {string} owner_id is used to define which user created the iteration
 * @member {string} place_id is used to define which place the iteration is made from
 * @member {string} name is used to give a custom name to the map marker
 * @member {string[]} tagsIdList is used to filter which tags are available for the iteration
 * @member {ITag[]} tagsList contains the tag data for the iteration
 */

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

/**
 * Contains the value for a filter for tag display, will be given more values to filter with in the future
 *
 * @interface IPlaceFilterQuery
 * 
 * @member {string} name is for filtering the existing places by name using a regex
 * @member {string} tagName is for filtering the existing tags by name using a regex
 * @member {ITag[]} tags contains the list of tags sought after within places
 */

export interface IPlaceFilterQuery {
    filterNameQuery: string;
    filterTagQuery: string;
    tags: ITag[];
}

/**
 * Will contain the values necessary to update place iterations
 *
 * @interface IPlaceIterationValues
 * 
 * @member {string} customDescription is used to give a custom description to the map marker
 * @member {string} customName is used to give a custom name to the map marker
 * @member {string[]} customTagIds contains the tag data for the iteration
 * 
 */

export interface IPlaceIterationValues {
    customDescription: string;
    customName: string;
    customTagIds: string[];
}

/**
 * Defines the values necessary to create a place iteration in the database
 *
 * @interface IPlaceIteration
 * 
 * @member {string | undefined} _id is used for calling upon the place iteration when needed
 * @member {string} associatedMapIds is the ids of maps the iteration is associated with
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} creatorId is used to identify the creator of the place iteration
 * @member {string} customName is used to give a custom name to a pre exiting map marker
 * @member {string} customDescription is used to give a custom description to a pre exiting map marker
 * @member {string[]} customTagIds is used to gather tag IDs whether custom made or not 
 * @member {IGPSCoordinates} gpsCoordinates is a copy of the pre existing marker's gps coordinates 
 * @member {string} placeId is used to retrieve tag data
 */

export interface IPlaceIteration {
    _id?: string;
    associatedMapIds: string[];
    creationDate?: Date;
    creatorId: string;
    customName: string;
    customDescription: string;
    customTagIds: string[];
    gpsCoordinates: IGPSCoordinates;
    placeId: string;
};

/**
 * Contains the value for a filter for tag display, will be given more values to filter with in the future
 *
 * @interface ITagFilterQuery
 * 
 * @member {string} tagName is for filtering the existing tags by name using a regex
 */

export interface ITagFilterQuery {
    tagName: string;
}

/**
 * Contains the data for a map marker whether it is a place or an iteration
 *
 * @interface IMarkersForMap
 * 
 * @member {string | undefined} _id is used for calling upon the place iteration when needed
 * @member {string} address is used to allow users to find a path to the map marker
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} description is used by the owner to describe the place they are placing on the map
 * @member {IGPSCoordinates} gpsCoordinates is used to locate the marker on the map
 * @member {string | undefined} owner_id is used to define which user created the place or iteration
 * @member {string} name is used to name the place's marker on the map
 * @member {string[]} tagsIdList is used to filter which tags are available for the iteration
 * @member {ITag[]} tagsList is to help users find the place through tag filtering or to check if the place suits their needs
 * @member {boolean} isIteration indicates whether the place is an iteration or not
 */

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

/**
 * Contains the values of user inputs required to register a new place
 *
 * @interface IPlaceRegisterValues
 * 
 * @member {string} name is used to name the place's marker on the map
 * @member {string} description is used by the owner to describe the place they are placing on the map
 * @member {string} address is used to allow users to find a path to the map marker
 * @member {IGPSCoordinates} gpsCoordinates is used to locate the place's marker on the map
 * @member {ITag[]} tagList is to help users find the place through tag filtering or to check if the place suits their needs
 */

export interface IPlaceRegisterValues {
    name: string;
    description: string;
    address: string;
    gpsCoordinates: IGPSCoordinates
    tagList: ITag[];
}