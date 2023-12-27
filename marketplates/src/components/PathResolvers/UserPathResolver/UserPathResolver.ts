import { useNavigate } from "react-router-dom";
import { UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";

const UserPathResolver = (props: { userTypes: string, children: React.ReactNode }) => {
    const navigate = useNavigate();
    const userTypesArray = props.userTypes.split("&");

    //Check if the user is logged in
    useEffect(() => {
        if (!userTypesArray.includes(UserType.User)) {
            navigate("/login");
        }
    });


    return props.children;
};

export default UserPathResolver