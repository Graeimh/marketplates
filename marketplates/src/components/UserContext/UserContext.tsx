import { createContext } from "react";

interface IUserContext {
  email: string;
  displayName: string;
  userId: string;
  status: string;
  iat: number;
}

const UserContext = createContext<IUserContext>({
  email: "",
  displayName: "",
  userId: "",
  status: "",
  iat: 0,
});

export default UserContext;
