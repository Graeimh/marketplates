import { useNavigate } from "react-router-dom";
import { UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";

const AdminPathResolver = (props: { userTypes: string, children: React.ReactNode }) => {
    const navigate = useNavigate();
    const userTypesArray = props.userTypes.split("&");

    //Check if the user is logged in and an admin
    useEffect(() => {
        if (!userTypesArray.includes(UserType.Admin)) {
            navigate("/");
        }
    });


    return props.children;
};

export default AdminPathResolver