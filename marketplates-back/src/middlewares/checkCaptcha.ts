import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import axios from 'axios'

// Allows to fetch values from the .env file
dotenv.config();

/**
   * Checks if the captcha in the front end was passed correctly
   *
   *
   * @param req - The request object associated with the route
   * @param res - The response object associated with the route
   * @param next - The function to call to allow passage to the next route
   * 
   * @catches - If the route can't be reached (500) or if the response from google's server catches (403)
*/

export async function checkCaptcha(req, res, next) {
    try {
        // Retrieve the server-side captcha token key provided by ReCaptcha and stored on the server
        const { CAPTCHA_TOKEN_KEY } = process.env;

        if (req.body.captchaToken.length === 0) {
            return res.status(403).send({ message: '(401 Not Authorized)-The captcha value is empty', success: false });
        }

        // Send a request to GoogleAPI containing both the server-side captcha token as secret and the output provided by the client side captcha as a response
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_TOKEN_KEY}&response=${req.body.captchaToken}`
        );
        if (response.data.success) {
            next()
        } else {
            return res.status(403).send({ message: '(403 Forbidden)-The captcha value cannot be found or was incorrect', success: false });
        }
    }
    catch (err) {
        res.status(500).json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false,
        });
    }
}