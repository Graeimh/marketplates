import { createContext } from "react";
import { ISessionValues } from "../../../common/types/userTypes/userTypes";

const UserContext = createContext<ISessionValues>({
  email: "",
  displayName: "",
  userId: "",
  status: "",
  iat: 0,
  exp: 0,
});

export default UserContext;
