import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserPathResolver = (props: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    //Check if the user is logged in
    useEffect(() => {
        const refreshValue = localStorage.getItem("refreshToken");
        if (refreshValue === null) {
            navigate("/login");
        }
    }
    );

    return props.children;
};

export default UserPathResolver