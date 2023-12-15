import UserModel from "../models/Users.js"
import argon2 from 'argon2';
import jwt from "jsonwebtoken"
import { IUser } from "../types.js";


export async function login(req, res) {
    const matchingUser = await UserModel.findOne({ email: req.body.loginData.email })
    if (!matchingUser) {
        res.status(404).json({
            message: '(404 Not Found)-The user was not found',
            success: false
        });
    } else if (req.body.loginData.email.length === 0 || req.body.loginData.password.length === 0 || !await argon2.verify(matchingUser.password, req.body.loginData.password)) {
        res.status(401).json({
            message: '(401 Unauthorized)-Either the email/password are missing, or they do not match.',
            success: false,
        });
    } else {
        try {
            const { LOG_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

            const accessToken = createToken(matchingUser, LOG_TOKEN_KEY);
            const refreshToken = createToken(matchingUser, REFRESH_TOKEN_KEY, "1y");

            res.cookie(
                "token", accessToken, {
                httpOnly: true,
                maxAge: 10 * 1000,
            }
            )

            matchingUser.refreshToken = [...matchingUser.refreshToken, refreshToken];
            await matchingUser.save()

            return res.status(200).json({
                message: '(200 OK)-Login successful.',
                refreshToken,
                success: true,
            });
        }
        catch (err) {
            res.json({
                message: '(500 Internal Server Error)-A server side error has occured.',
                success: false,
            });
        }
    }
}

function createToken(user: IUser, token: string, expirationDate?: string): string {
    return expirationDate ? jwt.sign({
        email: user.email,
        displayName: user.displayName,
        userId: user._id.toString(),
        status: user.type.join('&')
    }, token, { expiresIn: expirationDate })
        : jwt.sign({
            email: user.email,
            displayName: user.displayName,
            userId: user._id.toString(),
            status: user.type.join('&')
        }, token)
}

export async function produceNewAccessToken(req, res, next) {
    //Check if the refresh token exists
    if (req.body.refreshToken) {
        //Fetch secrets
        const { LOG_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

        //Access the user using the data stored within the Refresh Token
        const matchingUser = await UserModel.findOne({ email: jwt.decode(req.body.refreshToken).email })

        //Filtering out all the expired tokens from the user refresh token list
        const todayDate = Date.now().toString()
        const expirationDateChecker = Number(todayDate.slice(0, todayDate.length - 3));
        const actualUserTokenList = matchingUser.refreshToken.filter(token => jwt.decode(token).exp >= expirationDateChecker);

        matchingUser.refreshToken = actualUserTokenList;
        await matchingUser.save();
        try {
            //Verify user-based data from within the refresh token
            const decryptedRefreshToken = jwt.verify(req.body.refreshToken, REFRESH_TOKEN_KEY);

            //Check if the user's database entry does contain the refresh token, if it does not, the user most likely attempted to attack the website
            if (!actualUserTokenList.includes(req.body.refreshToken)) {
                //LOG OUT
                return res.status(403).json({
                    message: '(403 Forbidden)-The token does not match the existing tokens or is expired.',
                    success: false,
                });
            }

            //Create a new access token for the user
            const newAccessToken = createToken(matchingUser, LOG_TOKEN_KEY);

            //Provide the browser cookies with the new user-nased access token 
            res.status(201).cookie(
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
        res.status(401).json({
            message: '(401 Unauthorized)-The token was not found.',
            success: false,
        });
    }
}

export async function logout(req, res) {
    try {
        //Fetch user-based refresh token as well as secrets
        const fetchedRefreshToken = req.body.refreshToken;
        const { REFRESH_TOKEN_KEY } = process.env;

        //Verify and unpack user-based data from within the refresh token
        const decryptedRefreshToken = jwt.verify(fetchedRefreshToken, REFRESH_TOKEN_KEY);

        const matchingUser = await UserModel.findOne({ email: decryptedRefreshToken.email })

        //Take away the refresh token from the list of valid refresh tokens
        matchingUser.refreshToken.filter(token => fetchedRefreshToken);
        await matchingUser.save();

        res.clearCookie("token").status(204).json({
            message: '(204 No Content)-Successfully logged out.',
            success: true,
        }).end();
    }
    catch (err) {
        res.clearCookie("token").status(204).json({
            message: '(204 No Content)-Successfully logged out.',
            success: true,
        }).end();
    }
}

export async function checkSessionStatus(req, res) {
    try {
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY } = process.env;

        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        res.json({
            cookie: req.cookies.token
        })

    }
    catch (err) {
        res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false,
        });
    }
};

export function checkIfActive(req, res) {
    res.status(200).json({
        message: "GOT ME!"
    })
}