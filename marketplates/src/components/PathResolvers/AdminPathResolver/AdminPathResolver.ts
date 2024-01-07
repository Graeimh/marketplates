import { useNavigate } from "react-router-dom";
import { ISessionValues, UserType } from "../../../common/types/userTypes/userTypes";
import { useEffect } from "react";
import * as jose from "jose";
import { checkPermission } from "../../../common/functions/checkPermission";

/**
   * Checks if an user has the correct permissions to access a front end route reserved for admins.
   * 
   * 
   * @param {React.ReactNode} children - Contains the component under the path resolver
   *
   * @returns A navigation towards the home page
*/
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