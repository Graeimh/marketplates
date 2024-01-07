import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
   * Checks if an user has the correct permissions to access a front end route for logged users
   *
   * 
   * @param {React.ReactNode} children - Contains the component under the path resolver
   *
   * @returns A navigation towards the login page
*/
const UserPathResolver = (props: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in
    useEffect(() => {
        const refreshValue = localStorage.getItem("refreshToken");
        if (refreshValue === null) {
            return navigate("/login");
        }
    }
    );

    return props.children;
};

export default UserPathResolver