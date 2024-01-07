import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
   * Checks if an user has the correct permissions to access a front end route reserved for visiting users.
   * Avoids double log ins
   * 
   * @param {React.ReactNode} children - Contains the component under the path resolver
   *
   * @returns A navigation towards the home page
*/
const NonLoggedPathResolver = (props: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in
    useEffect(() => {
        const refreshValue = localStorage.getItem("refreshToken");
        if (refreshValue !== null) {
            navigate("/");
        }
    }
    );

    return props.children;
};

export default NonLoggedPathResolver