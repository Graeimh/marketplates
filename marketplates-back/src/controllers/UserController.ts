import UserModel from "../models/Users.js"
import { IUser, UserType } from "../types.js";
import argon2 from 'argon2';
import sanitizeHtml from 'sanitize-html';

export async function createUser(req, res) {
  try {
    const preExistingUser = await UserModel.find({ email: req.body.formData.email });

    if (preExistingUser.length > 0) {
      res.status(403).json({
        message: '(403 Forbidden)-This email adress is already in use',
        success: false
      });
    } else {
      const user: IUser = {
        activeBasketlistIds: [],
        displayName: sanitizeHtml(req.body.formData.nickName, { allowedTags: [] }),
        email: sanitizeHtml(req.body.formData.email, { allowedTags: [] }),
        firstName: sanitizeHtml(req.body.formData.firstName, { allowedTags: [] }),
        lastName: sanitizeHtml(req.body.formData.lastName, { allowedTags: [] }),
        location: { addressType: [], denomination: "" },
        password: await argon2.hash(sanitizeHtml(req.body.formData.password, { allowedTags: [] })),
        profilePicture: { imageURL: "", imageCaption: "", },
        recipes: { favoriteRecipes: [], customRecipes: [], },
        type: [UserType.User],
      }

      await UserModel.create(user);
      res.status(201).json({
        message: '(201 Created)-User Created',
        success: true
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      message: '(403 Forbidden)-The data sent created a user type conflict',
      success: false
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const allUsers = await UserModel.find();
    res.json({
      data: allUsers,
      message: '(200 OK)-Successfully fetched all users',
      success: true
    });
  } catch (err) {
    res.json({
      message: '(404 Not found)-No user was found',
      success: false
    });
  }
}