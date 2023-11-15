import mongoose, { Types } from "mongoose";

export enum AddressType {
    Address = "Address",
    County = "County",
    City = "City",
    Country = "Country"
};

export enum ContentType {
    ProductUpdate = "Product update",
    MenuUpdate = "Menu update",
};

export enum CurrencyType {
    Euro = "Euros (€)",
    Dollar = "Dollars ($)",
    Pound = "Pounds (£)",
};

export interface IAddressData {
    addressType: AddressType[],
    denomination: string,
};

export interface IAppliances {
    _id?: Types.ObjectId;
    applianceName: string;
    picture: IImageData;
};

export interface IBasket {
    _id?: Types.ObjectId;
    content: IShoppingListItem[];
    name: string;
    orginalOwnerId: string;
};

export interface IImageData {
    imageURL: string;
    imageCaption: string;
};

export interface IIteration {
    _id?: Types.ObjectId;
    images: IImageData[];
    name: string;
    placeIds: Types.ObjectId[];
    price: IPriceData[];
    productId: Types.ObjectId;
    opinionIds: Types.ObjectId[];
    specificDescription: string;
    tagIds: Types.ObjectId[]
};

export interface IMenu {
    _id?: Types.ObjectId;
    description: string
    name: string
    owner_id?: Types.ObjectId;
    sectionIds: Types.ObjectId[];
    price: IPriceData[]
};

export interface IMenuItem {
    _id?: Types.ObjectId;
    description: string;
    name: string;
    owner_id?: Types.ObjectId;
    price: IPriceData[];
    tagIds: Types.ObjectId[];
};

export interface IMenuSections {
    _id?: Types.ObjectId;
    name: string,
    menuItemIds: Types.ObjectId[]
};

export interface IOpinion {
    _id?: Types.ObjectId;
    attachementPicture: IImageData;
    emittingUserId: Types.ObjectId;
    grade: number;
    opinion: string;
    originId: Types.ObjectId;
};

export interface IPlace {
    _id?: Types.ObjectId;
    address: IAddressData;
    description: string;
    iterationIds: Types.ObjectId[];
    name: string;
    placeOpinionIds: Types.ObjectId[];
};

export interface IPost {
    _id?: Types.ObjectId;
    attachementPictures: IImageData[];
    creationDate: Date;
    emittingUserId: Types.ObjectId;
    contentType: ContentType[];
    textContent: string;
};

export interface IPriceData {
    currency: CurrencyType;
    monetaryCost: number;
    volumeObtained?: ProductVolumes;
};

export interface IProduct {
    _id?: Types.ObjectId;
    associatedRecipeIds: Types.ObjectId[];
    description: string;
    iterationIds: Types.ObjectId[];
    name: string;
    pairingsProductIds: Types.ObjectId[];
    picture: IImageData;
    sources: string[];
    tagIds: Types.ObjectId[];
};

export interface IRecipe {
    _id?: Types.ObjectId;
    applianceIds: Types.ObjectId[];
    description: string;
    name: string;
    pictures: IImageData[];
    productIds: Types.ObjectId[];
    steps: string[];
};

export interface IRecipeElement {
    quantity: number;
    volume: ProductVolumes;
    productId: string;
};


export interface IShoppingListItem {
    iterationId: Types.ObjectId;
    quantity: number;
};

export interface ITag {
    _id?: Types.ObjectId;
    color: string;
    icon: IImageData;
    name: string;
    tagAffinities: ITagAffinity[];
};

export interface ITagAffinity {
    affinity: number;
    tagId: Types.ObjectId;
    //0 means never suggested, 5 means always suggested
};

export interface IUser {
    _id?: Types.ObjectId;
    activeBasketlistIds: Types.ObjectId[];
    email: string;
    firstName: string;
    lastName: string;
    location: IAddressData;
    password: string;
    profilePicture: IImageData
    recipes: IUserRecipes;
    type: UserType[];

};

export interface IUserRecipes {
    favoriteRecipes: Types.ObjectId[];
    customRecipes: Types.ObjectId[];
};

export enum ProductVolumes {
    Kg = "Kg",
    Lbs = "Lbs",
    L = "L",
    Unit = "Unit",
};

export enum UserType {
    Restaurant = "Address",
    Shop = "County",
    Admin = "City",
    User = "User",
};













