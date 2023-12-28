import { useNavigate } from "react-router-dom";
import { UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";
import { checkPermission } from "../../../common/functions/checkPermission";

const AdminPathResolver = (props: { userTypes: string, children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in and an admin
    useEffect(() => {
        if (!checkPermission(props.userTypes, UserType.Admin)) {
            navigate("/");
        }
    });


    return props.children;
};

export default AdminPathResolver