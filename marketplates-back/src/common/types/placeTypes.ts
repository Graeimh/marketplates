import { Types } from "mongoose";
import { IGPSCoordinates } from "./commonTypes.js";

/**
 * Defines the values necessary to create a place in the database
 *
 * @interface IPlace
 * 
 * @member {Types.ObjectId | undefined} _id is used for calling upon the place when needed
 * @member {string} address is used to allow users to find a path to the map marker
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {string} description is used by the owner to describe the place they are placing on the map
 * @member {IGPSCoordinates} gpsCoordinates is used to locate the place's marker on the map
 * @member {Types.ObjectId} owner_id is used to identify which user owns the place
 * @member {string} name is used to name the place's marker on the map
 * @member {Types.ObjectId[]} tagsList is used to gather tags by IDs to assign to the place's data
 */

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