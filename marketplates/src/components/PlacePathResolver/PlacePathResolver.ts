import { useNavigate } from "react-router-dom";
import { UserType } from "../../common/types/userTypes/userTypes";
import { useEffect } from "react";

const PlacePathResolver = (props: { userTypes: string, children: React.ReactNode }) => {
    const navigate = useNavigate();
    const userTypesArray = props.userTypes.split("&");

    useEffect(() => {
        if (!userTypesArray.includes(UserType.Restaurant) && !userTypesArray.includes(UserType.Shop)) {
            navigate("/explore");
        }
    });


    return props.children;
};

export default PlacePathResolver