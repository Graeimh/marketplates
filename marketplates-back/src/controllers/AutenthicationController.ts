import UserModel from "../models/Users.js"
import argon2 from 'argon2';
import jwt from "jsonwebtoken"
import { IUser } from "../types.js";


export async function login(req, res) {
    const matchingUser: IUser = await UserModel.findOne({ email: req.body.loginData.email })
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
            const { LOG_TOKEN_KEY } = process.env;
            const token = jwt.sign({
                email: matchingUser.email,
                displayName: matchingUser.displayName,
                userId: matchingUser._id.toString(),
                status: matchingUser.type.join(', ')
            }, LOG_TOKEN_KEY, { expiresIn: "1h" });

            res.cookie(
                "token", token, {
                httpOnly: true,
            }
            );
            return res.status(200).json({
                message: '(200 OK)-Login successful.',
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
        res.json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false,
        });
    }
};

export function checkIfActive(req, res) {
    res.json({
        message: "GOT ME!"
    })
}