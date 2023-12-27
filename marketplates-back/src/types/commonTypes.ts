/**
 * Serves to contain the GPS coordinates for markers 
 *
 * @interface IGPSCoordinates
 * @member {number | null} longitude is used for longitude
 * @member {number | null} latitude is used for latitude
 */

export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}


/**
 * Serves to contain precise values for addresses, values can be left empty for privacy reasons 
 *
 * @interface IAddressData
 * @member {string | undefined} streetAddress is used for the location's street address
 * @member {string | undefined} county is used for the location's county
 * @member {string | undefined} city is used for the location's city
 * @member {string | undefined} country is used for the location's country
 */

export interface IAddressData {
    streetAddress?: string,
    county?: string,
    city?: string,
    country?: string,
};

/**
 * Serves to contain the data for future pictures 
 *
 * @interface IAddressData
 * @member {string} imageURL is used to give the URL to fetch the image from
 * @member {string} imageCaption is used to fill in the alt parameter for accessiblity reasons

 */

export interface IImageData {
    imageURL: string;
    imageCaption: string;
};