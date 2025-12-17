import React from "react";
import { useLocation } from "react-router-dom";

// Only render wrapped content on non-auth routes to avoid mounting sidebar/fetches.
const MaybeshowNavbar = ({ children }) => {
  const location = useLocation();
  const hiddenRoutes = ["/", "/ForgetPassword"];
  const shouldShow = !hiddenRoutes.includes(location.pathname);

  if (!shouldShow) return null;
  return <>{children}</>;
};

export default MaybeshowNavbar;
