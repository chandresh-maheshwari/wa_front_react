/* eslint-disable react/jsx-pascal-case */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import "./App.css"
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


function App() {
  return (
    <BrowserRouter basename="/cms">
      <MaybeshowNavbar>
        <Servicenave />
        <Sidebar />
      </MaybeshowNavbar>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ForgetPassword" element={<ForgetPasswordForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/dynamic-form" element={<Dynamicform />} />
        <Route path="/dynamic-list-data" element={<DynamicList />} />
        <Route path="/dynamic-edit/:id" element={<DynamicEditForm />} />
        <Route path="/post-form" element={<PostFormDynamic />} />
        <Route path="/post-list" element={<PostDynamicList />} />
        <Route path="/post-edit/:id" element={<PostDynamicEdit />} />
        <Route path="/Page" element={<Page />} />
        <Route path="/Page-list" element={<PageList />} />
        <Route path="/Page-edit/:id" element={<PageEdit />} />
        <Route path="/Contact-listing" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



