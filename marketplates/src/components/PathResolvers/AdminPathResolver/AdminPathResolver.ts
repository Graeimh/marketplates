import { useNavigate } from "react-router-dom";
import { ISessionValues, UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";
import * as jose from "jose";
import { checkPermission } from "../../../common/functions/checkPermission";

const AdminPathResolver = (props: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in and an admin

    useEffect(() => {
        const refreshValue = localStorage.getItem("refreshToken");
        if (refreshValue && refreshValue !== null) {
            const userSessionData: ISessionValues = jose.decodeJwt(refreshValue);
            if (!checkPermission(userSessionData.status, UserType.Admin)) {
                navigate("/");
            }
        }
    });


    return props.children;
};

export default AdminPathResolver