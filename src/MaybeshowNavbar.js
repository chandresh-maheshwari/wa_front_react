import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MaybeshowNavbar = ({ children }) => {

    const Location = useLocation();
    const [shownavbar, setshownavbar] = useState(false)
    useEffect(() => {
        if (Location.pathname === '/') {
            setshownavbar(false)
        } else if (Location.pathname === '/ForgetPassword') {
            setshownavbar(false)
        }
        else {
            setshownavbar(true)
        }
    }, [Location]);

    return (
        <div>
            {shownavbar && children}
        </div>
    )
}

export default MaybeshowNavbar;

