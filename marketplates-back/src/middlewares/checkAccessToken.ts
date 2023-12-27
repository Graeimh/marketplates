import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Allows to fetch values from the .env file
dotenv.config();

/**
   * Checks if the access token provided is still valid.
   *
   *
   * @param req - The request object associated with the route
   * @param res - The response object associated with the route
   * @param next - The function to call to allow passage to the next route
   * 
   * @catches - If the access token is expired (401), not valid (403), or non existent (401)
*/

export function checkAccessToken(req, res, next) {
    if (req.cookies.token) {
        try {
            // Fetching the token key for access tokens from .env
            const { LOG_TOKEN_KEY } = process.env;

            // Checking if the access token is valid
            jwt.verify(req.cookies.token, LOG_TOKEN_KEY)
            next();
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({
                    message: '(401 Not authorized)-The access token has expired.',
                    success: false,
                });
            } else {
                res.status(403).json({
                    message: '(403 Forbidden)-The access token is not valid.',
                    success: false,
                });
            }
        }
    } else {
        res.status(401).json({
            message: '(401 Not authorized)-No token was provided.',
            success: false,
        });
    }
}