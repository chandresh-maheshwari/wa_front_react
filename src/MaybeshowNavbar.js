import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MaybeshowNavbar = ({ children }) => {
  const location = useLocation();
  const [shownavbar, setshownavbar] = useState(true);

  useEffect(() => {
    const hiddenRoutes = ["/", "/ForgetPassword"];
    const shouldShow = !hiddenRoutes.includes(location.pathname);

    setshownavbar(shouldShow); // ✅ Always update, let React handle re-renders
  }, [location.pathname]); // ✅ only depend on route

  return <>{shownavbar && children}</>;
};

export default MaybeshowNavbar;
