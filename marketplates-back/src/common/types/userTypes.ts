import { Types } from "mongoose";
import { IAddressData, IImageData } from "./commonTypes.js";

/**
 * Contains the different possible statuses for users, for now only User and Admin are used
 * 
 * @member Admin is for administrators who can moderate content
 * @member Restaurant is for restaurants that seek to gain advertising by creating their marker on the maps
 * @member Shop is for shops whether regular or pop ups that seek to gain advertising by creating their marker on the maps
 * @member User is for casual users that seek to browse maps and customize markers
 */

export enum UserType {
    Admin = "Admin",
    Restaurant = "Restaurant",
    Shop = "Shop",
    User = "User",
};

/**
 * Defines the values necessary to create a user in the database 
 *
 * @interface 
 * 
 * @member {Types.ObjectId | undefined} _id is used for calling upon the user when needed 
 * @member {Types.ObjectId[]} activeBasketlistIds will used in the future to assign baskets to a user 
 * @member {Date | undefined} creationDate is not yet used but can serve to date edits or celebrate user birthdays
 * @member {string} displayName is the name other users will see when interacting with the user
 * @member {string} email serves for login, and, in the future, advertisement and password changes
 * @member {string} firstName serves for potential promotional emails
 * @member {string} lastName serves for potential promotional emails 
 * @member {IAddressData} location will help locate and center the map around the user's location in the future 
 * @member {string} password serves to protect the user's login process
 * @member {IImageData} profilePicture will serve in the future to store the user's profile picture url and caption
 * @member {IUserRecipes} recipes will serve in the future to store favorite and self-made recipes
 * @member {string[]} refreshToken serves to store all valid refresh tokens used by the user, allowing them to gain valid access tokens from several locations
 * @member {UserType[]} type is used to identify what group the user belongs to, a user can be a combination of several statuses
 */

export interface IUser {
    _id?: Types.ObjectId;
    activeBasketlistIds: Types.ObjectId[];
    creationDate?: Date;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    location: IAddressData;
    password: string;
    profilePicture: IImageData
    recipes: IUserRecipes;
    refreshToken?: string[];
    type: UserType[];
};

/**
 * Contains a user's favorite and self-made recipes, a future functionality
 *
 * @interface IUserRecipes
 * 
 * @member {Types.ObjectId[]} favoriteRecipes is used to store the ids of the user's favorite recipes
 * @member {Types.ObjectId[]} customRecipes is used to store the ids of the user's self-made recipes
 */

export interface IUserRecipes {
    favoriteRecipes: Types.ObjectId[];
    customRecipes: Types.ObjectId[];
};