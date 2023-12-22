import mongoose, { Types } from "mongoose";

export enum AddressType {
    Address = "Address",
    County = "County",
    City = "City",
    Country = "Country"
};

export enum AnomalyType {
    Breach = "Breach",
    Report = "Report",
    Request = "Request",
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

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
};

export enum ProductVolumes {
    Kg = "Kg",
    Lbs = "Lbs",
    L = "L",
    Unit = "Unit",
};

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}

export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
};

export interface IAddressData {
    streetAddress?: string,
    county?: string,
    city?: string,
    country?: string,
};

export interface IAnomalies {
    _id: Types.ObjectId,
    anomalyType: AnomalyType,
    creationDate?: Date;
    culpritUserId: Types.ObjectId,
    joinedPictures: IImageData,
    originUserId: Types.ObjectId,
    textContent: string,
    title: string,
};

export interface IAppliances {
    _id?: Types.ObjectId;
    applianceName: string;
    creationDate?: Date;
    picture: IImageData;
};

export interface IBasket {
    _id?: Types.ObjectId;
    creationDate?: Date;
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
    creationDate?: Date;
    images: IImageData[];
    name: string;
    placeIds: Types.ObjectId[];
    price: IPriceData[];
    productId: Types.ObjectId;
    opinionIds: Types.ObjectId[];
    specificDescription: string;
    tagIds: Types.ObjectId[]
};

export interface IMaps {
    _id?: Types.ObjectId;
    creationDate?: Date;
    description: string
    name: string
    ownerId: Types.ObjectId;
    participants: IParticipants[];
    placeIterationIds: Types.ObjectId[];
    privacyStatus: PrivacyStatus;
};

export interface IMenu {
    _id?: Types.ObjectId;
    creationDate?: Date;
    description: string
    name: string
    owner_id?: Types.ObjectId;
    sectionIds: Types.ObjectId[];
    price: IPriceData[]
};

export interface IMenuItem {
    _id?: Types.ObjectId;
    creationDate?: Date;
    description: string;
    name: string;
    owner_id?: Types.ObjectId;
    price: IPriceData[];
    tagIds: Types.ObjectId[];
};

export interface IMenuSections {
    _id?: Types.ObjectId;
    creationDate?: Date;
    name: string,
    menuItemIds: Types.ObjectId[]
};

export interface IOpinion {
    _id?: Types.ObjectId;
    attachementPicture: IImageData;
    creationDate?: Date;
    emittingUserId: Types.ObjectId;
    grade: number;
    opinion: string;
    targetId: Types.ObjectId;
};

export interface IParticipants {
    userId: Types.ObjectId;
    userPrivileges: UserPrivileges[];
}

export interface IPlace {
    _id?: Types.ObjectId;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id: Types.ObjectId;
    name: string;
    tagsList: Types.ObjectId[];
};

export interface IGPSCoordinates {
    longitude: number | null;
    latitude: number | null;
}

export interface IPlaceIteration {
    _id?: Types.ObjectId;
    associatedMapIds: Types.ObjectId[];
    creationDate?: Date;
    creatorId: Types.ObjectId;
    customName: string;
    customDescription: string;
    customTagIds: Types.ObjectId[];
    gpsCoordinates: IGPSCoordinates;
    placeId: Types.ObjectId;
};

export interface IPlaceUpdated {
    _id?: Types.ObjectId;
    address: string;
    creationDate?: Date;
    description: string;
    gpsCoordinates: IGPSCoordinates;
    owner_id?: string;
    name: string;
    tagsIdList: Types.ObjectId[];
    tagsList: ITag[];
}


export interface IPost {
    _id?: Types.ObjectId;
    attachementPictures: IImageData[];
    creationDate?: Date;
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
    creationDate?: Date;
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
    creationDate?: Date;
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
    backgroundColor: string;
    creationDate?: Date;
    creatorId: Types.ObjectId;
    isOfficial: boolean;
    nameColor: string;
    name: string;
    tagAffinities?: ITagAffinity[];
};

export interface ITagAffinity {
    affinity: number;
    tagId: Types.ObjectId;
    //0 means never suggested, 5 means always suggested
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

