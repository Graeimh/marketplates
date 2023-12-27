import { createContext } from "react";
import { IUserContext } from "../../../common/types/userTypes/userTypes";

const UserContext = createContext<IUserContext>({
  email: "",
  displayName: "",
  userId: "",
  status: "",
  iat: 0,
});

export default UserContext;
