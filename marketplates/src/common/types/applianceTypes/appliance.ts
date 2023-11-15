import { IPicture } from "../pictureTypes/picture";

export interface IAppliance {
  _id: string;
  applianceName: string;
  picture: IPicture
}