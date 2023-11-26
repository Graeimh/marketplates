export interface IRegisterValues {
    email: string;
    firstName: string;
    lastName: string;
    nickName: string;
    password: string;
    passwordMatch: string;
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