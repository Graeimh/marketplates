import AppliancesModel from "../models/Appliances.js"
import { IAppliances } from "../types.js";

export async function createAppliance(req, res) {
  try {
    const appliance: IAppliances = {
      applianceName: req.body.applianceName,
      picture: {
        imageURL: req.body.imageURL,
        imageCaption: req.body.imageCaption,
      }
    };

    await AppliancesModel.create(appliance);

    res.status(201).json({
      message: '(201 Created)-Appliance Created',
      success: true
    });
  } catch (err) {
    res.status(403).json({
      message: '(403 Forbidden)-The data sent created an appliance type conflict',
      success: false
    });
  };
}
export async function getAppliances(req, res) {
  try {
    const allAppliances = await AppliancesModel.find();
    res.status(200).json({
      data: allAppliances,
      message: '(200 OK)-Successfully fetched all appliances',
      success: true
    });
  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-No appliance was found',
      success: false
    });
  }
}

export async function getAppliancesByIds(req, res) {
  try {
    const appliancesByIds = await AppliancesModel.find({ _id: { $in: req.params.ids.split("&") } });
    res.status(200).json({
      data: appliancesByIds,
      message: '(200 OK)-Successfully fetched all the requested appliances',
      success: true
    });
  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-No appliance matching was found',
      success: false
    });
  }
}

export async function updateApplianceById(req, res) {
  try {
    const applianceById: IAppliances = await AppliancesModel.findOne({ _id: { $in: req.body.applianceId } });

    const applianceToUpdate = await AppliancesModel.updateOne({ _id: { $in: req.body.applianceId } }, {
      applianceName: req.body.applianceName ? req.body.applianceName : applianceById._id, picture: {
        imageURL: req.body.pictureURL ? req.body.pictureURL : applianceById.picture.imageURL,
        imageCaption: req.body.pictureCaption ? req.body.pictureCaption : applianceById.picture.imageCaption
      }
    });

    res.status(204).json({
      message: '(204 No Content)-Appliance successfully updated',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-Appliance to be updated was not found',
      success: false
    });
  }
}

export async function deleteApplianceById(req, res) {
  try {
    const applianceToDelete = await AppliancesModel.deleteOne({ _id: { $in: req.body.applianceId } });

    res.status(204).json({
      message: '(204 No Content)-Appliance successfully deleted',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-Appliance to be deleted was not found',
      success: false
    });
  }
}

export async function deleteAppliancesByIds(req, res) {
  try {
    const appliancesToDelete = await AppliancesModel.deleteMany({ '_id': { '$in': req.body.applianceIds } });

    res.status(204).json({
      message: '(204 No Content)-Appliances successfully deleted',
      success: true
    });

  } catch (err) {
    res.status(404).json({
      message: '(404 Not found)-One or several appliances to be deleted were not found',
      success: false
    });
  }
}
