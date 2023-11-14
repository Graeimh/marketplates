import AppliancesModel from "../models/Appliances.js"
import { IAppliances } from "../types.js";
// import { randomInt } from 'node:crypto'

export async function createAppliance(req, res) {
  try {
    const appliance: IAppliances = {
      applianceName: req.body.applianceName,
      picture: {
        imageURL: req.body.imageURL,
        imageCaption: req.body.imageCaption,
      }
    }
    await AppliancesModel.create(appliance)
    res.json(req.body);
  } catch (err) {
    res.json(err);
  }
}
export async function getAppliances(req, res) {
  try {
    const allAppliances = await AppliancesModel.find();
    res.json(allAppliances);
  } catch (err) {
    res.json(err);
  }
}

export async function getAppliancesByIds(req, res) {

  try {
    const appliancesByIds = await AppliancesModel.find({ _id: { $in: req.params.ids.split("&") } });
    res.json(appliancesByIds);
  } catch (err) {
    res.json(err);
  }
}

export async function updateAppliance(req, res) {
  try {
    res.json(req.body);
  } catch (err) {
    res.json(err);
  }
}

export async function deleteAppliance(req, res) {
  try {
    res.json(req.body);
  } catch (err) {
    res.json(err);
  }
}

// export async function getRemainingPastriesData(req, res) {
//   try {
//       const remainingPastries = await PastriesModel.find( { quantity: { $gt: 0 } } )
//       res.json(remainingPastries);
//   } catch (err) {
//       res.json(err);
//   }
// }

// export async function getPrizes(req, res) {
//   try {
//     const aggregatedValue = {};
//     req.body.diceResults.forEach(function (x) { aggregatedValue[x] = (aggregatedValue[x] || 0) + 1; });
//     const countValues = Object.values(aggregatedValue);

//     const maximumMatchingAmount = Math.max(...countValues)
//     let prizeResponse = {prizeList: [], date: new Date()}

//       if (maximumMatchingAmount == 5){
//         prizeResponse.prizeList = await getPastriesForPrizes(3)
//       } else if (maximumMatchingAmount == 4) {
//         prizeResponse.prizeList = await getPastriesForPrizes(2)
//       } else if (maximumMatchingAmount < 4 && maximumMatchingAmount >= 2) {
//         prizeResponse.prizeList = await getPastriesForPrizes(1)
//       }

//     await UsersModel.updateOne({ _id : req.body.userId}, {$set:{prize:prizeResponse}})
//     res.json(prizeResponse)
//   } catch (err) {
//     res.json(err);
//   }

// }

// export async function getPastriesForPrizes(amount, userId) {
//   const prizeList = [];

//   for (let i = 0; i < amount; i++) {
//     const listOfRemainingPastries = await PastriesModel.find( { quantity: { $gt: 0 } } )
//     const locatedPastryIndex = randomInt(0, listOfRemainingPastries.length - 1);
//     const pastryOfChoice = listOfRemainingPastries[locatedPastryIndex];
//     prizeList.push(pastryOfChoice.pastryName);

//     await PastriesModel.updateOne({ _id : pastryOfChoice._id}, {$set:{quantity:(pastryOfChoice.quantity-1)}})
//   }
//   return prizeList
// }
