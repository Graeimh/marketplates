import { v4 } from 'uuid';
import jwt from "jsonwebtoken"
import { createCipheriv, randomBytes } from 'node:crypto'
import UserModel from "../models/Users.js"

export async function generateCSRFToken(req, res) {
    try {
        //Fetching the user's session token as well as the server based secrets
        const cookieValue = req.cookies.token;
        const { LOG_TOKEN_KEY, CSRF_TOKEN_KEY } = process.env;

        //Obtaining the session's data to find the correct user
        const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

        //Finding the user the token will be generated for
        const matchingUser = await UserModel.findOne({ email: decryptedCookie.email })

        //Assembing the variables for the token's creation: the current timestamp and the User CSRF secret and the server side's CSRF secret
        const currentTimestamp = Date.now().toString();
        const userTokenBase = matchingUser.csrfSecret.toString();

        // creating a random value to add to the token's raw value as suggested by documentation
        const additionalRandom = randomBytes(32).toString("hex").slice(0, 32);

        // creating an iv or initialization vector, its role is to increase the security of the encryption and decryption using randomness.
        const iv = randomBytes(16).toString("hex").slice(0, 16);

        //Fabricating the user-based token message
        const CSRFToken = (`${additionalRandom}&-&${currentTimestamp}&-&${userTokenBase}}`)

        console.log("Hey", CSRF_TOKEN_KEY, iv)
        //Fabricating the encrypted token message through createCipheriv
        const cipher = createCipheriv("aes-256-cbc", CSRF_TOKEN_KEY, iv);
        const encryptedToken = Buffer.concat([cipher.update(CSRFToken), cipher.final()]).toString('base64');

        console.log("encryptedToken", encryptedToken)
        //Saving the new CSRF Token value in the user's data
        matchingUser.csrfToken = CSRFToken;
        matchingUser.csrfTokenKey = iv;
        await matchingUser.save();

        //Giving back the token's encrypted value to be set in the session on the frontend
        return res.status(200).json({
            message: '(200 OK)-CSRF Token successfully created.',
            token: encryptedToken,
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
