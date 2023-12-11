export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    password: string;
    passwordMatch: string;
}

export interface ITagValues {
    backgroundColor: string;
    creatorId: string;
    isOfficial: boolean;
    nameColor: string;
    tagName: string;
}

export interface IMapValues {
    description: string;
    name: string;
    userId: string;
    privacyStatus: PrivacyStatus;
}

export enum PrivacyStatus {
    Private = "Private",
    Protected = "Protected",
    Public = "Public",
};

export interface IPlaceValues {
    city: string;
    country: string;
    county: string;
    description: string;
    name: string;
    streetAddress: string;
}

export interface IPlaceIterationValues {
    mapId: string;
    userId: string;
    customName: string;
    customDescription: string;
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

export enum UserType {
    Restaurant = "Restaurant",
    Shop = "Shop",
    Admin = "Admin",
    User = "User",
}