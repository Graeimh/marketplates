import { createContext } from "react";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes";

// This context's purpose is to store messages from website operations and display them
const MessageContext = createContext<IMessageValues>({
  message: "",
  successStatus: true,
});

export default MessageContext;
