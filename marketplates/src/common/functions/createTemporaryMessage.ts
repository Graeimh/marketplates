/**
   * Creates a temporary message that will disappear after a set amount of time
   *
   * 
   * @param {string} message - The message to be displayed
   * @param {number} time - The time the message will be displayed in milliseconds
   * @param {React.Dispatch<React.SetStateAction<string>>} setResponseMessage - The react set state required to change the message's value in the component
   * 
*/
export default function createTemporaryMessage(
    message: string,
    time: number,
    setResponseMessage: React.Dispatch<React.SetStateAction<string>>
): void {
    setResponseMessage(message);
    setTimeout(() => {
        setResponseMessage("");
    }, time);
}