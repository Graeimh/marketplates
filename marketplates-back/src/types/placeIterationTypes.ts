import { Types } from "mongoose";

import { IGPSCoordinates } from "./commonTypes.js";
import { ITag } from "./tagTypes.js";

/**
 * Defines the values necessary to create a place iteration in the database
 *
 * @interface IPlaceIteration
 * 
 * @member {Types.ObjectId | undefined} _id is used for calling upon the place iteration when needed
 * @member {string} associatedMapIds is a copy of the pre existing marker's address
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {Types.ObjectId} creatorId is used to identify the creator of the place iteration
 * @member {IGPSCoordinates} customName is a copy of the pre existing marker's gps coordinates
 * @member {string | undefined} customDescription is used to identify which user owns the iteration
 * @member {string} customTagIds is used to give a custom name to a pre exiting map marker
 * @member {Types.ObjectId[]} gpsCoordinates is used to gather tag IDs whether custom made or not
 * @member {ITag[]} placeId is used to retrieve tag data
 */

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

/**
 * Defines values used during the creation of place iterations during map editing
 *
 * @interface IPlaceUpdated
 * 
 * @member {Types.ObjectId | undefined} _id is used for calling upon the place iteration when needed
 * @member {string} address is a copy of the pre existing marker's address
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} description is used to give a custom description to a pre exiting map marker
 * @member {IGPSCoordinates} gpsCoordinates is a copy of the pre existing marker's gps coordinates
 * @member {string | undefined} owner_id is used to identify which user owns the iteration
 * @member {string} name is used to give a custom name to a pre exiting map marker
 * @member {Types.ObjectId[]} tagsIdList is used to gather tag IDs whether custom made or not
 * @member {ITag[]} tagsList is used to retrieve tag data
 */


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