import UserModel from "../models/Users.js"
import argon2 from 'argon2';
import sanitizeHtml from 'sanitize-html';
import { IUser, UserType } from "../common/types/userTypes.js";
import jwt from "jsonwebtoken"
import checkOwnership from "../common/functions/checkOwnership.js";


/**
   * Creates a user
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the email used matches with that of an existing user (403), or if the data provided causes an error in the creation of the user (403) 
   * @responds - By informing the user their data has been saved into the database (201)
*/
export async function createUser(req, res) {
  try {
    // Check if a user with the same email doesn't already exist
    const preExistingUser = await UserModel.find({ email: req.body.formData.email });

    if (preExistingUser.length > 0) {
      return res.status(403).json({
        message: '(403 Forbidden)-This email adress is already in use',
        success: false
      });
    } else {
      // Creating the user according to the IUser interface, sanitizing every text input given using sanitizeHtml
      const user: IUser = {
        activeBasketlistIds: [],
        displayName: sanitizeHtml(req.body.formData.displayName, { allowedTags: [] }),
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

      return res.status(201).json({
        message: '(201 Created)-User Created',
        success: true
      });
    }
  } catch (err) {
    return res.status(403).json({
      message: '(403 Forbidden)-The data sent created a user type conflict',
      success: false
    });
  }
}

/**
   * Fetches all users
   *
   *
   * @param req - The request object associated with the route parameters, not used here
   * @param res - The response object associated with the route
   * 
   * @catches - If no user is found (404)
   * @responds - With an array of all the users in the database (200)
*/
export async function getAllUsers(req, res) {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).json({
      data: allUsers,
      message: '(200 OK)-Successfully fetched all users',
      success: true
    });
  } catch (err) {
    return res.status(404).json({
      message: '(404 Not found)-No user was found',
      success: false
    });
  }
}

/**
   * Fetches all users matching to the Ids given
   *
   *
   * @param req - The request object associated with the route parameters, specifically the Ids in the params
   * @param res - The response object associated with the route
   * 
   * @catches - If no map is found (404)
   * @responds - With an array of users who match the Ids given (200)
*/
export async function getUsersById(req, res) {
  try {
    // Ids, when sent in groups are sent in a single string, each Id tied to the others by a & character, hence the need for a split on that character
    const allUsers = await UserModel.find({ _id: { $in: req.params.ids.split("&") } });
    return res.status(200).json({
      data: allUsers,
      message: '(200 OK)-Successfully fetched all users by Ids',
      success: true
    });
  } catch (err) {
    return res.status(404).json({
      message: '(404 Not found)-No users were found',
      success: false
    });
  }
}

/**
   * Updates a user's data in the database
   *
   *
   * @param req - The request object associated with the route parameters, specifically the formData held within the body
   * @param res - The response object associated with the route
   * 
   * @catches - If the user to update was not found (404)
   * @responds - With a message informing the user the update is done (204)
*/
export async function updateUserById(req, res) {

  try {
    // Find the user to update
    const userById: IUser = await UserModel.findOne({ _id: req.body.userId });

    // Get access token from the front end and the key that serves to create and verify them
    const cookieValue = req.cookies.token;
    const { LOG_TOKEN_KEY } = process.env;

    // Get the token's contents, verifying its validity in the process
    const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

    if (checkOwnership(userById._id, decryptedCookie.userId, decryptedCookie.status)) {
      // Updating the user according to the IUser interface, sanitizing every text input given using sanitizeHtml, keeping the old values if no new one is given
      await UserModel.updateOne({ _id: req.body.userId }, {
        displayName: req.body.formData.displayName ? sanitizeHtml(req.body.formData.displayName, { allowedTags: [] }) : userById.displayName,
        email: req.body.formData.email ? sanitizeHtml(req.body.formData.email, { allowedTags: [] }) : userById.email,
        firstName: req.body.formData.firstName ? sanitizeHtml(req.body.formData.firstName, { allowedTags: [] }) : userById.firstName,
        lastName: req.body.formData.lastName ? sanitizeHtml(req.body.formData.lastName, { allowedTags: [] }) : userById.lastName,
        location: {
          streetAddress: req.body.formData.streetAddress ? sanitizeHtml(req.body.formData.streetAddress, { allowedTags: [] }) : userById.location.streetAddress,
          county: req.body.formData.county ? sanitizeHtml(req.body.formData.county, { allowedTags: [] }) : userById.location.county,
          city: req.body.formData.city ? sanitizeHtml(req.body.formData.city, { allowedTags: [] }) : userById.location.city,
          country: req.body.formData.country ? sanitizeHtml(req.body.formData.country, { allowedTags: [] }) : userById.location.country,
        },
      }
      );

      return res.status(204).json({
        message: '(204 No Content)-User data successfully updated',
        success: true
      });
    } else {
      return res.status(403).json({
        message: '(403 Forbidden)-The user is not the owner of the account, or an admin and thus cannot update the data from this user',
        success: false
      });
    }

  } catch (err) {
    return res.status(404).json({
      message: '(404 Not found)-User to be updated was not found',
      success: false
    });
  }
}

/**
   * Deletes a specific user
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no matching user is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteUserById(req, res) {
  try {
    const userById: IUser = await UserModel.findOne({ _id: req.params.ids });

    // Get access token from the front end and the key that serves to create and verify them
    const cookieValue = req.cookies.token;
    const { LOG_TOKEN_KEY } = process.env;

    // Get the token's contents, verifying its validity in the process
    const decryptedCookie = jwt.verify(cookieValue, LOG_TOKEN_KEY);

    if (checkOwnership(userById._id, decryptedCookie.userId, decryptedCookie.status)) {
      await UserModel.deleteOne({ _id: { $in: req.params.ids } });

      return res.status(204).json({
        message: '(204 No Content)-User successfully deleted',
        success: true
      });
    } else {
      return res.status(403).json({
        message: '(403 Forbidden)-The user is not the owner of the account, or an admin and thus cannot delete the account from this user',
        success: false
      });
    }
  } catch (err) {
    return res.status(404).json({
      message: '(404 Not found)-User to be deleted was not found',
      success: false
    });
  }
}

/**
   * Deletes a specific set of users
   *
   *
   * @param req - The request object associated with the route parameters, especially its body property
   * @param res - The response object associated with the route
   * 
   * @catches - If no user is found (404)
   * @responds - With a message informing the user the deletion has been carried out (204)
*/
export async function deleteUsersByIds(req, res) {
  try {
    await UserModel.deleteMany({ _id: { $in: req.params.ids.split("&") } });

    return res.status(204).json({
      message: '(204 No Content)-Users successfully deleted',
      success: true
    });

  } catch (err) {
    return res.status(404).json({
      message: '(404 Not found)-One or several users to be deleted were not found',
      success: false
    });
  }
}
