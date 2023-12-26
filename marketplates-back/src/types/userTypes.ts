import { Types } from "mongoose";
import { IAddressData, IImageData } from "./commonTypes.js";

export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
};

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

export interface IUserRecipes {
    favoriteRecipes: Types.ObjectId[];
    customRecipes: Types.ObjectId[];
};