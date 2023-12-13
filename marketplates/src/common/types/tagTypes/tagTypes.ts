export interface ITag {
    _id: string;
    backgroundColor: string;
    creatorId: string;
    isOfficial: string;
    nameColor: string;
    tagAffinities?: ITagAffinity[];
    name: string;
}

export interface ITagAffinity {
    affinity: number;
    tagId: string;
}

export interface ITagStyle {
    color: string;
    backgroundColor: string;
}