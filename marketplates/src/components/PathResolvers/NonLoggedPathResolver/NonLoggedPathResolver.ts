import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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