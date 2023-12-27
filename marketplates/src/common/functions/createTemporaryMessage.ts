export default function createTemporaryMessage(
    message: string,
    time: number,
    setResponseMessage: React.Dispatch<React.SetStateAction<string>>
) {
    setResponseMessage(message);
    setTimeout(() => {
        setResponseMessage("");
    }, time);
}