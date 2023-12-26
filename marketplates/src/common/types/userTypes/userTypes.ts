export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    country: string;
    city: string;
    county: string;
    streetAddress: string;
    password: string;
    passwordMatch: string;
}

export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    country: string;
    city: string;
    county: string;
    streetAddress: string;
    password: string;
    passwordMatch: string;
}

export interface IUserContext {
    email: string;
    displayName: string;
    userId: string;
    status: string;
    iat: number;
}

export interface IUserData {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    country: string;
    county: string;
    city: string;

}

export enum UserPrivileges {
    Editer = "Editer",
    Viewer = "Viewer",
    Owner = "Owner",
}

export interface ILoginValues {
    email: string;
    password: string;
}

export interface IPasswordFitnessCriteria {
    isLengthCorrect: boolean;
    containsUppercase: boolean;
    containsLowerCase: boolean;
    containsNumbers: boolean;
    containsSpecialCharacter: boolean;
}

export interface IUser {
    _id: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    location: IUserLocation;
}

export interface IUserLocation {
    city: string
    country: string
    county: string
    streetAddress: string
}

export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
}