/**
 * Contains the different possible statuses for users, for now only User and Admin are used
 * 
 * @member Admin is for administrators who can moderate content
 * @member Restaurant is for restaurants that seek to gain advertising by creating their marker on the maps
 * @member Shop is for shops whether regular or pop ups that seek to gain advertising by creating their marker on the maps
 * @member User is for casual users that seek to browse maps and customize markers
 */

export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
}

/**
 * Defines the values necessary to create a user in the database
 *
 * @interface IRegisterValues
 * 
 * @member {string} email serves for login, and, in the future, advertisement and password changes
 * @member {string} firstName serves for potential promotional emails
 * @member {string} lastName serves for potential promotional emails 
 * @member {string} nickName is the name other users will see when interacting with the user
 * @member {string} city city is used for the user's city
 * @member {string} country country is used for the user's country
 * @member {string} county county is used for the user's county
 * @member {string} streetAddress streetAddress is used for the user's street address
 * @member {string} password contains the password determined by the user
 * @member {string} passwordMatch is used to check if the user has entered their password a second time correctly
 */
export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    city: string;
    country: string;
    county: string;
    streetAddress: string;
    password: string;
    passwordMatch: string;
}

/**
 * Defines the values contained within the user's session context
 *
 * @interface IUserContext
 * 
 * @member {string} email serves for login, and, in the future, advertisement and password changes
 * @member {string} displayName is the name other users will see when interacting with the user
 * @member {string} userId is used for calling upon the user when needed or give ownership to created database items
 * @member {string} status is the user's status, strung together using & symbols
 * @member {number} iat or instanciated at, determines the time at which the session has been created
 */

export interface IUserContext {
    email: string;
    displayName: string;
    userId: string;
    status: string;
    iat: number;
}

/**
 * Defines the values necessary to update a place in the database
 *
 * @interface IUserData
 * 
 * @member {string} displayName is the name other users will see when interacting with the user
 * @member {string} email serves for login, and, in the future, advertisement and password changes
 * @member {string} firstName serves for potential promotional emails
 * @member {string} lastName serves for potential promotional emails 
 * @member {string} city city is used for the user's city
 * @member {string} country country is used for the user's country
 * @member {string} county county is used for the user's county
 * @member {string} streetAddress streetAddress is used for the user's street address
 */

export interface IUserData {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    county: string;
    streetAddress: string;
}

/**
 * Contains the values required when logging in
 *
 * @interface ILoginValues
 * 
 * @member {string} email is used for user identification in the database when logging in
 * @member {string} password is used to give access or not to website's features when logging in
 */

export interface ILoginValues {
    email: string;
    password: string;
}

/**
 * Contains the different parameters required for a password to be accepted when registering
 *
 * @interface IPasswordFitnessCriteria
 * 
 * @member {boolean} isLengthCorrect stores the information on whether or not the password is at least 12 characters long
 * @member {boolean} containsUppercase stores the information on whether or not the password contains at least one upper case character
 * @member {boolean} containsLowerCase stores the information on whether or not the password contains at least one lower case character
 * @member {boolean} containsNumbers stores the information on whether or not the password contains at least one number
 * @member {boolean} containsSpecialCharacter stores the information on whether or not the password contains at least 1 special character
 */

export interface IPasswordFitnessCriteria {
    isLengthCorrect: boolean;
    containsUppercase: boolean;
    containsLowerCase: boolean;
    containsNumbers: boolean;
    containsSpecialCharacter: boolean;
}

/**
 * Contains the user's data when pulled from the database 
 *
 * @interface IUser
 * 
 * @member {string} _id is used for calling upon the user when needed
 * @member {string} displayName is the name other users will see when interacting with the user
 * @member {string} email serves for login, and, in the future, advertisement and password changes
 * @member {string} firstName serves for potential promotional emails
 * @member {string} lastName serves for potential promotional emails
 * @member {IUserLocation} location contains all the details to locate the user if given
 */

export interface IUser {
    _id: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    location: IUserLocation;
}

/**
 * Serves to contain precise values for addresses
 *
 * @interface IUserLocation
 * 
 * @member {string} city is used for the user's city
 * @member {string} country is used for the user's country
 * @member {string} county is used for the user's county
 * @member {string} streetAddress is used for the user's street address
 */


export interface IUserLocation {
    city: string
    country: string
    county: string
    streetAddress: string
}