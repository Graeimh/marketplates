import jwt from 'jsonwebtoken';
import { UserType } from '../common/types/userTypes.js';

/**
   * Checks if the user is an admin.
   *
   *
   * @param req - The request object associated with the route
   * @param res - The response object associated with the route
   * @param next - The function to call to allow passage to the next route
   * 
   * @catches - If the access token is no token is provided (401), if the user is not an admin (403), or an error has occured (500)
*/

export function checkIfAdmin(req, res, next) {
    if (req.cookies.token) {
        try {
            // Fetching the token key for access tokens from .env
            const { LOG_TOKEN_KEY } = process.env;

            // Checking if the access token is valid
            const decryptedCookie = jwt.verify(req.cookies.token, LOG_TOKEN_KEY)

            // Checking if there is an admin status amidst the status affected to the user
            if (decryptedCookie.status.indexOf(UserType.Admin) !== -1) {
                next();
            } else {
                return res.status(403).json({
                    message: '(403 Forbidden)-The user is not an admin and cannot perform this call.',
                    success: false,
                });
            }
        }
        catch (err) {
            return res.status(500).json({
                message: '(500 Internal Server Error)-An error has occured.',
                success: false,
            });
        }
    } else {
        res.status(401).json({
            message: '(401 Not authorized)-No token was provided.',
            success: false,
        });
    }
}