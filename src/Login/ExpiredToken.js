// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import Authapi from "../Authapi";
// import localStorage from "local-storage";
// import { jwtDecode } from "jwt-decode";

// const Expired = () => {
//     const [isTokenExpired, setIsTokenExpired] = useState(false);
//     const [hasShownPopup, setHasShownPopup] = useState(false);

//     const checkTokenExpiry = () => {
//         const token = localStorage.get("Token");
//         // console.log("Token: ", token);

//         if (!token) {
//             setIsTokenExpired(true);
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             // console.log("Decoded Token: ", decodedToken);

//             const currentTime = Date.now() / 1000;
//             if (decodedToken.exp < currentTime) {
//                 setIsTokenExpired(true);
//             }
//         } catch (error) {
//             console.error("Error decoding token:", error);
//             setIsTokenExpired(true);
//         }
//     };


//     const regenerateToken = async () => {
//         try {
//             let formData = {
//                 user_id: localStorage("user").id
//             };
//             const newToken = await Authapi.refreshToken1(formData);
//             console.log("New Token: ", newToken.data.add_token);

//             if (newToken.data.add_token) {
//                 localStorage("Token", newToken.data.add_token);
//                 setIsTokenExpired(false);
//                 Swal.fire("Success", "Your session has been refreshed!", "success");
//                 window.location.reload();
//             } else {
//                 Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Error refreshing token: ", error);
//             Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
//         }
//     };

//     useEffect(() => {
//         checkTokenExpiry();
//     }, []);


//     // if (isTokenExpired) {
//     //     Swal.fire({
//     //         title: "Session Expired",
//     //         text: "Your session has expired. Do you want to continue?",
//     //         icon: "warning",
//     //         showCancelButton: true,
//     //         confirmButtonText: "Continue",
//     //         cancelButtonText: "Cancel",
//     //     }).then((result) => {
//     //         console.log(result);
//     //         if (result.isConfirmed === true) {
//     //             regenerateToken();
//     //         }
//     //     });
//     // }

//     if (isTokenExpired && !hasShownPopup) {
//         setHasShownPopup(true);
//         Swal.fire({
//             title: "Session Expired",
//             text: "Your session has expired. Do you want to continue?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Continue",
//             cancelButtonText: "Cancel",
//         }).then((result) => {
//             // console.log(result);
//             if (result.isConfirmed === true) {
//                 regenerateToken();
//             }
//         });
//     }

//     // useEffect(() => {

//     // }, []);

//     return null;
// };

// export default Expired;



import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Authapi from "../Authapi";
import localStorage from "local-storage";
import { jwtDecode } from 'jwt-decode';


const Expired = () => {
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [hasShownPopup, setHasShownPopup] = useState(false);

    // Function to check token expiry
    const checkTokenExpiry = () => {
        const token = localStorage.get("Token");
        if (!token) {
            setIsTokenExpired(true);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds

            // Set the expiry time to 1 minute from the token's issue time
            const tokenExpiryTime = decodedToken.iat + 1800; // 60 seconds = 1 minute

            if (tokenExpiryTime < currentTime) {
                setIsTokenExpired(true);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setIsTokenExpired(true);
        }
    };

    // Function to regenerate token
    const regenerateToken = async () => {
    try {
        let formData = {
            user_id: localStorage.get("user").id
        };

        const newToken = await Authapi.refreshToken1(formData);

        if (newToken.data.api_token) {
            localStorage.set("Token", newToken.data.api_token);
            setIsTokenExpired(false);
            setHasShownPopup(false);

            Swal.fire("Success", "Your session has been refreshed!", "success");
        } else {
            throw new Error("Token missing in response");
        }

    } catch (error) {
        console.error("Refresh Token Error:", error);
        Swal.fire("Error", "Failed to regenerate token. Please try again.", "error");
    }
};


    // Effect to check for token expiration immediately when the component is mounted
    useEffect(() => {
        checkTokenExpiry();
        // Set an interval to check for token expiration every second (1000ms)
        const interval = setInterval(() => {
            checkTokenExpiry();
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Effect to show the popup when token expires
    useEffect(() => {
        if (isTokenExpired && !hasShownPopup) {
            setHasShownPopup(true);
            Swal.fire({
                title: "Session Expired",
                text: "Your session has expired. Do you want to continue?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    regenerateToken();
                }
            });
        }
    }, [isTokenExpired, hasShownPopup]); // Trigger when token expires or popup state changes

    return null;
};

export default Expired;
