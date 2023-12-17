
export interface IPlace {
    _id: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id: string;
    name: string;
    tagsList: string[];
}

export interface IPlaceData {
    _id?: string;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id: string;
    name: string;
    tagsList: string[];
};

export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}