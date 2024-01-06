import { createContext } from "react";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes";

const MessageContext = createContext<IMessageValues>({
  message: "",
  successStatus: true,
});

export default MessageContext;
