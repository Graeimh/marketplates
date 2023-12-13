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
        location: {
          streetAddress: req.body.formData.streetAddress ? sanitizeHtml(req.body.formData.streetAddress, { allowedTags: [] }) : "",
          county: req.body.formData.county ? sanitizeHtml(req.body.formData.county, { allowedTags: [] }) : "",
          city: req.body.formData.city ? sanitizeHtml(req.body.formData.city, { allowedTags: [] }) : "",
          country: req.body.formData.country ? sanitizeHtml(req.body.formData.country, { allowedTags: [] }) : "",
        },
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

export async function getUsersById(req, res) {
  try {
    const allUsers = await UserModel.find({ _id: { $in: req.params.ids.split("&") } });
    res.json({
      data: allUsers,
      message: '(200 OK)-Successfully fetched all users by Ids',
      success: true
    });
  } catch (err) {
    res.json({
      message: '(404 Not found)-No users were found',
      success: false
    });
  }
}

export async function updateUserById(req, res) {

  try {
    const userById: IUser = await UserModel.findOne({ _id: { $in: req.body.userId } });

    const userToUpdate = await UserModel.updateOne({ _id: { $in: req.body.userId } }, {
      displayName: req.body.displayName ? sanitizeHtml(req.body.displayName, { allowedTags: [] }) : userById.displayName,
      email: req.body.email ? sanitizeHtml(req.body.email, { allowedTags: [] }) : userById.email,
      firstName: req.body.firstName ? sanitizeHtml(req.body.firstName, { allowedTags: [] }) : userById.firstName,
      lastName: req.body.lastName ? sanitizeHtml(req.body.lastName, { allowedTags: [] }) : userById.lastName,
      location: {
        streetAddress: req.body.streetAddress ? sanitizeHtml(req.body.streetAddress, { allowedTags: [] }) : userById.location.streetAddress,
        county: req.body.county ? sanitizeHtml(req.body.county, { allowedTags: [] }) : userById.location.county,
        city: req.body.city ? sanitizeHtml(req.body.city, { allowedTags: [] }) : userById.location.city,
        country: req.body.country ? sanitizeHtml(req.body.country, { allowedTags: [] }) : userById.location.country,
      },
    }
    );

    res.status(204).json({
      message: '(204 No Content)-User data successfully updated',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-User to be updated was not found',
      success: false
    });
  }
}

export async function deleteUserById(req, res) {
  try {
    const userToDelete = await UserModel.deleteOne({ _id: { $in: req.body.userId } });

    res.status(204).json({
      message: '(204 No Content)-User successfully deleted',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-User to be deleted was not found',
      success: false
    });
  }
}

export async function deleteUsersByIds(req, res) {
  try {
    const usersToDelete = await UserModel.deleteMany({ _id: { $in: req.body.tagIds } });

    res.status(204).json({
      message: '(204 No Content)-Users successfully deleted',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-One or several users to be deleted were not found',
      success: false
    });
  }
}
