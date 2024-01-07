import { createContext } from "react";
import { ISessionValues } from "../../../common/types/userTypes/userTypes";

// This context's purpose is to provide data on whether or not a user is logged in
const UserContext = createContext<ISessionValues>({
  email: "",
  displayName: "",
  userId: "",
  status: "",
  iat: 0,
  exp: 0,
});

export default UserContext;
