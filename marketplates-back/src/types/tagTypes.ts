import { Types } from "mongoose";

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

export interface ITagAffinity {
    affinity: number;
    tagId: Types.ObjectId;
    //0 means never suggested, 5 means always suggested
};