import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

export function checkAccessToken(req, res, next) {
    if (req.cookies.token) {
        try {
            const { LOG_TOKEN_KEY } = process.env;
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