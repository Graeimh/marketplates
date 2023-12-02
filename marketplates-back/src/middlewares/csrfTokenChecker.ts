import { createDecipheriv } from 'node:crypto'
import jwt from "jsonwebtoken"
import UserModel from "../models/Users.js"

export async function csrfTokenChecker(req, res, next) {
  try {
    //Fetching the user's session token as well as the server based secrets
    const cookieValue = req.cookies.token;
    const { LOG_TOKEN_KEY, CSRF_TOKEN_KEY } = process.env;

    //Obtaining the session's data to find the correct user
    const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

    //Finding the user the token will be generated for
    const matchingUser = await UserModel.findOne({ email: decryptedCookie.email })
    const userIVKey = matchingUser.csrfTokenKey;

    const decrypter = createDecipheriv("aes-256-cbc", CSRF_TOKEN_KEY, userIVKey);
    const decryptedMessage = Buffer.concat([
      decrypter.update(req.body.CSRFValue, 'base64'),
      decrypter.final()
    ]).toString();

    if (decryptedMessage === matchingUser.csrfToken) {
      next();
    }
  } catch (err) {
    res.json({
      message: '(401 Unauthorized)-The CSRF Token provided does not match.',
      success: false,
    });
  }
}