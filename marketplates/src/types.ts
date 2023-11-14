export interface IAppliances {
    name: string;
    picture: IImageData;
}

export interface IImageData {
    _id?: string;
    imageURL: string;
    imageCaption: string;
}