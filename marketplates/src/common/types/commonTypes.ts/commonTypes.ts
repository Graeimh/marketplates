/**
 * Serves to contain the GPS coordinates for markers 
 *
 * @interface IGPSCoordinates
 * @member {number | null} longitude is used for longitude
 * @member {number | null} latitude is used for latitude
 * 
 */

export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}

/**
 * Serves to contain the data for future pictures 
 *
 * @interface IAddressData
 * @member {string} imageURL is used to give the URL to fetch the image from
 * @member {string} imageCaption is used to fill in the alt parameter for accessiblity reasons
 *
 */

export interface IImageData {
    _id?: string;
    imageURL: string;
    imageCaption: string;
}