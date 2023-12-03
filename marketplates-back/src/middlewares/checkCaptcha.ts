import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import axios from 'axios'

dotenv.config();

export async function checkCaptcha(req, res, next) {
    try {
        //Retrieve the server-side captcha token key provided by ReCaptcha and stored on the server
        const { CAPTCHA_TOKEN_KEY } = process.env;

        //Send a request to GoogleAPI containing both the server-side captcha token as secret and the output provided by the client side captcha as a response
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_TOKEN_KEY}&response=${req.body.captchaToken}`
        );
        if (response.data.success) {
            next()
        } else {
            res.status(403).send({ error: true, message: '(403 Forbidden)-The captcha value cannot be found or was incorrect' });
        }
    }
    catch (err) {
        res.json({
            message: '(500 Internal Server Error)-A server side error has occured.',
            success: false,
        });
    }
}