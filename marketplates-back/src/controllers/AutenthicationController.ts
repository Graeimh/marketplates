import UserModel from "../models/Users.js";
import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import { IUser } from "../common/types/userTypes.js";

/**
   * Allows a user to be authenticated when providing the correct credentials
   *
   *
   * @param req - The request object associated with the route parameters
   * @param res - The response object associated with the route
   * 
   * @catches - If the user doesn't exist (404), there is a mismatch in credentials (401), or if the route can't be reached (500)
   * @responds - With an access token and refresh token given to the front end, the refresh token is also stored in the user's data
*/

export async function login(req, res) {

    // Checking if the user that attempts to log in isn't already logged in
    const cookieValue = req.cookies.token;

    if (cookieValue !== undefined) {
        return res.status(403).json({
            message: '(403 Forbidden)-An user is already logged in',
            success: false
        });
    }

    // Checking if the user exists in the database
    const matchingUser = await UserModel.findOne({ email: req.body.loginData.email })

    if (!matchingUser) {
        return res.status(404).json({
            message: '(404 Not Found)-The user was not found',
            success: false
        });

        // Checking if the credentials are filled in and if the user's password matches its hashed version from the user database
    } else if (req.body.loginData.email.length === 0 || req.body.loginData.password.length === 0 || !await argon2.verify(matchingUser.password, req.body.loginData.password)) {
        return res.status(401).json({
            message: '(401 Unauthorized)-Either the email/password are missing, or they do not match.',
            success: false,
        });
    } else {
        try {
            // Fetching the token key for access tokens and the token key to create a refresh token from .env
            const { LOG_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

            // Creating the access token
            const accessToken = createToken(matchingUser, LOG_TOKEN_KEY);

            // Creating the refresh token
            const refreshToken = createToken(matchingUser, REFRESH_TOKEN_KEY, "1y");

            // Setting a cookie in the front end with a validity of 10 minutes
            res.cookie(
                "token", accessToken, {
                httpOnly: true,
                maxAge: 10 * 60 * 1000,
            }
            );

            // Adding the new refresh token to the database
            matchingUser.refreshToken = [...matchingUser.refreshToken, refreshToken];
            await matchingUser.save()

            return res.status(200).json({
                message: '(200 OK)-Login successful.',
                refreshToken,
                success: true,
            });
        }
        catch (err) {
            return res.status(500).json({
                message: '(500 Internal Server Error)-A server side error has occured.',
                success: false,
            });
        }
    }
};

/**
   * Creates a token
   *
   *
   * @param {IUser} user - The user's data to give the proper details to the final token
   * @param {string} tokenKey - The token's key value which allows to differenciate between different token
   * @param {string | undefined} expirationDate - An optional expiration date
   * 
   * @returns - A signed token stored in a string
*/

function createToken(user: IUser, tokenKey: string, expirationDate?: string): string {
    // The return depends on whether or not an expiration date is given
    return expirationDate ? jwt.sign({
        email: user.email,
        displayName: user.displayName,
        userId: user._id.toString(),
        status: user.type.join('&')
    }, tokenKey, { expiresIn: expirationDate })
        : jwt.sign({
            email: user.email,
            displayName: user.displayName,
            userId: user._id.toString(),
            status: user.type.join('&'),
        }, tokenKey);
};

/**
   * Allows to produce a new access token for a user and pass it to the front end
   *
   *
   * @param req - The request object associated with the route parameters, most importantly, the refresh token held with the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the user provides the wrong token, or an expired one (403), or if there is no token given (404)
   * @responds - With a new access token with a longer expiration date than the one provided in the login
*/

export async function produceNewAccessToken(req, res) {
    //Check if the refresh token exists
    if (req.body.refreshToken) {
        //Fetch secrets
        const { LOG_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

        //Access the user using the data stored within the Refresh Token
        const matchingUser = await UserModel.findOne({ email: jwt.decode(req.body.refreshToken).email });

        //Filtering out all the expired tokens from the user refresh token list
        const todayDate = Date.now().toString();
        const expirationDateChecker = Number(todayDate.slice(0, todayDate.length - 3));
        const actualUserTokenList = matchingUser.refreshToken.filter(token => jwt.decode(token).exp >= expirationDateChecker);

        matchingUser.refreshToken = actualUserTokenList;
        await matchingUser.save();
        try {
            //Verify user-based data from within the refresh token
            jwt.verify(req.body.refreshToken, REFRESH_TOKEN_KEY);

            //Check if the user's database entry does contain the refresh token, if it does not, the user most likely attempted to attack the website
            if (!actualUserTokenList.includes(req.body.refreshToken)) {
                return res.status(403).json({
                    message: '(403 Forbidden)-The token does not match the existing tokens or is expired.',
                    success: false,
                });
            };

            //Create a new access token for the user
            const newAccessToken = createToken(matchingUser, LOG_TOKEN_KEY);

            //Provide the browser cookies with the new user-nased access token 
            return res.cookie(
                "token", newAccessToken, {
                httpOnly: true,
                maxAge: 10 * 60 * 1000,
            }).json({
                message: '(201 No content)-Access token successfully regenerated.',
                newAccessToken,
                success: true,
            });
        } catch (err) {
            return res.status(403).json({
                message: '(403 Forbidden)-The token is expired.',
                success: false,
            });
        }
    }
    else {
        return res.status(404).json({
            message: '(404 Not Found)-The token was not found.',
            success: false,
        });
    }
};

/**
   * Allows a user to logout from a location
   *
   *
   * @param req - The request object associated with the route parameters, most importantly, the refresh token held with the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the refresh token isn't given or if it isn't verified, but the token cookie is cleared either way just in case (204)
   * @responds - By clearing the token cookie, the given refresh token is also cleared from the user's data
*/

export async function logout(req, res) {
    try {
        // Fetch user-based refresh token as well as secrets
        const fetchedRefreshToken = req.body.refreshToken;
        const { REFRESH_TOKEN_KEY } = process.env;

        // Verify and unpack user-based data from within the refresh token
        const decryptedRefreshToken = jwt.verify(fetchedRefreshToken, REFRESH_TOKEN_KEY);

        const matchingUser = await UserModel.findOne({ email: decryptedRefreshToken.email });

        // Take away the refresh token from the list of valid refresh tokens
        matchingUser.refreshToken.filter(token => token !== fetchedRefreshToken);
        await matchingUser.save();

        return res.clearCookie("token").status(204).json({
            message: '(204 No Content)-Successfully logged out.',
            success: true,
        }).end();
    }
    catch (err) {
        return res.clearCookie("token").status(204).json({
            message: '(204 No Content)-Successfully logged out.',
            success: true,
        }).end();
    }
};

/**
   * Allows for a user to receive their session's data in the front end which is not accessible from the cookies
   *
   *
   * @param req - The request object associated with the route parameters, most importantly, the cookies it contains
   * @param res - The response object associated with the route
   * 
   * @catches - If the access token is not verified or if the route is not reached (500) 
   * @responds - By sending the sessions's data back to the user
*/

export async function checkSessionStatus(req, res) {
    try {
        // Fetch user-based access token as well as the token key used to create them
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        // Token verification
        jwt.verify(cookieValue, LOG_TOKEN_KEY);

        return res.status(200).json({
            cookie: req.cookies.token
        });
    }
    catch (err) {
        return res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false,
        });
    }
};