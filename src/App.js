/* eslint-disable react/jsx-pascal-case */
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import "./App.css";
import "./Service/Addrvices.css";
import Servicenave from "./Service/Servicenave";
import Login from "./Login/Login";
import ForgetPasswordForm from "./Login/ForgetPassword";
import Sidebar from "./Sidebar/Sidebar";
import MaybeshowNavbar from "./MaybeshowNavbar";
import Dynamicform from "./DymanicPost/Dynamic-form";
import DynamicList from "./DymanicPost/Dynamic-list-data";
import DynamicEditForm from "./DymanicPost/Dynamic-edit";
import PostFormDynamic from "./PostDynamicField/Post-form";
import PostDynamicList from "./PostDynamicField/Post-list";
import PostDynamicEdit from "./PostDynamicField/Post-edit";
import Page from "./Page/Page";
import PageEdit from "./Page/Page-edit";
import PageList from "./Page/Page-list";
import Contact from "./Page/Contact-listing";
import ls from "local-storage";

// ProtectedRoute Component for guarding the routes
function ProtectedRoute({ children }) {
  const isLoggedIn = ls('user') !== null; 
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter basename="/cms">
      <MaybeshowNavbar>
        {/* {ls('user') ? <Navigate to="/Dashboard" /> : <Login />}
        {<ProtectedRoute><Servicenave /></ProtectedRoute>} */}
        <Servicenave />
        {/* {ls('user') ? <Navigate to="/Dashboard" /> : <Login />}
        {<ProtectedRoute><Sidebar /></ProtectedRoute>} */}
        <Sidebar />
      </MaybeshowNavbar>
      <Routes>
        <Route path="/" element={ls('user') ? <Navigate to="/Dashboard" /> : <Login />} />
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* <Route path="/" element={ls('user') ? <Navigate to="/ForgetPassword" /> : <Login />} />
        <Route path="/ForgetPassword" element={<ProtectedRoute><ForgetPasswordForm /></ProtectedRoute>} /> */}
        <Route path="/ForgetPassword" element={<ForgetPasswordForm />} />
        {/* <Route path="/ForgetPassword" element={<ForgetPasswordForm />} />     */}

        <Route path="/" element={ls('user') ? <Navigate to="/dynamic-form" /> : <Login />} />
        <Route path="/dynamic-form" element={<ProtectedRoute><Dynamicform /></ProtectedRoute>} />
        {/* <Route path="/dynamic-list-data" element={<DynamicList />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/dynamic-list-data" /> : <Login />} />
        <Route path="/dynamic-list-data" element={<ProtectedRoute><DynamicList /></ProtectedRoute>} />

        <Route path="/" element={ls('user') ? <Navigate to="/dynamic-edit/:id" /> : <Login />} />
        <Route path="/dynamic-edit/:id" element={<ProtectedRoute><DynamicEditForm /></ProtectedRoute>} />

        <Route path="/" element={ls('user') ? <Navigate to="/post-form" /> : <Login />} />
        <Route path="/post-form" element={<ProtectedRoute><PostFormDynamic /></ProtectedRoute>} />
        {/* <Route path="/post-form" element={<PostFormDynamic />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/post-list" /> : <Login />} />
        <Route path="/post-list" element={<ProtectedRoute><PostDynamicList /></ProtectedRoute>} />
        {/* <Route path="/post-list" element={<PostDynamicList />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/post-edit/:id" /> : <Login />} />
        <Route path="/post-edit/:id" element={<ProtectedRoute><PostDynamicEdit /></ProtectedRoute>} />
        {/* <Route path="/post-edit/:id" element={<PostDynamicEdit />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/Page" /> : <Login />} />
        <Route path="/Page" element={<ProtectedRoute><Page /></ProtectedRoute>} />
        {/* <Route path="/Page" element={<Page />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/Page-list" /> : <Login />} />
        <Route path="/Page-list" element={<ProtectedRoute><PageList /></ProtectedRoute>} />
        {/* <Route path="/Page-list" element={<PageList />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/Page-edit/:id" /> : <Login />} />
        <Route path="/Page-edit/:id" element={<ProtectedRoute><PageEdit /></ProtectedRoute>} />
        {/* <Route path="/Page-edit/:id" element={<PageEdit />} /> */}

        <Route path="/" element={ls('user') ? <Navigate to="/Contact-listing" /> : <Login />} />
        <Route path="/Contact-listing" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        {/* <Route path="/Contact-listing" element={<Contact />} /> */}

        <Route path="*" element={<ProtectedRoute><Navigate to="/" /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

