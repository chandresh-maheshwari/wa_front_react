import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Authapi from "../Authapi";
import localStorage from "local-storage";
import { jwtDecode } from "jwt-decode";

const Expired = () => {
    const [isTokenExpired, setIsTokenExpired] = useState(false);


    const checkTokenExpiry = () => {
        const token = localStorage.get("Token");
        // console.log("Token: ", token);

        if (!token) {
            setIsTokenExpired(true);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            // console.log("Decoded Token: ", decodedToken);

            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                setIsTokenExpired(true);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setIsTokenExpired(true);
        }
    };


    const regenerateToken = async () => {
        try {
            let formData = {
                user_id: localStorage("user").id
            };
            const newToken = await Authapi.refreshToken1(formData);
            console.log("New Token: ", newToken.data.add_token);

            if (newToken.data.add_token) {
                localStorage("Token", newToken.data.add_token);
                setIsTokenExpired(false);
                Swal.fire("Success", "Your session has been refreshed!", "success");
                window.location.reload();
            } else {
                Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error refreshing token: ", error);
            Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
        }
    };

    



    useEffect(() => {
        checkTokenExpiry();
    }, []);


    if (isTokenExpired) {
        Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Do you want to continue?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
        }).then((result) => {
            console.log(result);
            if (result.isConfirmed === true) {
                regenerateToken();
            }
        });
    }

    useEffect(() => {

    }, []);

    return null;
};

export default Expired;
