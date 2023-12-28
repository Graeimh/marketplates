import { useNavigate } from "react-router-dom";
import { UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";
import { checkPermission } from "../../../common/functions/checkPermission";

const UserPathResolver = (props: { userTypes: string, children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in
    useEffect(() => {
        if (!checkPermission(props.userTypes, UserType.User)) {
            navigate("/login");
        }
    });


    return props.children;
};

export default UserPathResolver