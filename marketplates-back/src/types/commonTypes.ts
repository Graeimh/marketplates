export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}

export interface IAddressData {
    streetAddress?: string,
    county?: string,
    city?: string,
    country?: string,
};

export interface IImageData {
    imageURL: string;
    imageCaption: string;
};