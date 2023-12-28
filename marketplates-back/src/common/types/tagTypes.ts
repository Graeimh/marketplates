import { Types } from "mongoose";

/**
 * Defines the values necessary to create a tag in the database
 *
 * @interface ITag
 * 
 * @member {Types.ObjectId | undefined} _id is used for calling upon the tag when needed
 * @member {string} backgroundColor is a hexadecimal color value for the tag's background color
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits
 * @member {Types.ObjectId} creatorId is used to identify the tag's creator, helps with determining if the tag is official
 * @member {boolean} isOfficial is used to separate custom tags created by users and official ones created by admins
 * @member {string} nameColor is a hexadecimal color value for the tag's name
 * @member {string} name is the tag's name, often contains an emoji for the first character
 * @member {ITagAffinity[]} tagAffinities represents how likely it is that the tag will be paired with others
 */

export interface ITag {
    _id?: Types.ObjectId;
    backgroundColor: string;
    creationDate?: Date;
    creatorId: Types.ObjectId;
    isOfficial: boolean;
    nameColor: string;
    name: string;
    tagAffinities?: ITagAffinity[];
};

/**
 * Defines the likelyhood of a tag being paired with another, will change with how often tags are used together
 *
 * @interface ITagAffinity
 * 
 * @member {number} affinity is used to suggest more or less a tag to the user, 0 means never suggested, 5 means always suggested
 * @member {Types.ObjectId} tagId is used to point out which tag is concerned

 */

export interface ITagAffinity {
    affinity: number;
    tagId: Types.ObjectId;
};