/* eslint-disable react/jsx-pascal-case */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import './App.css';
import Addrvices from "./Addrvices";
import Servicelist from "./Servicelist";
import EditServiceForm from "./EditServiceForm";
import Login from "./Login";
import Testimonial from "./Testimonial";
import Testimonial_List from "./Testimonial_List";
import Testimonialedit from "./Testimonialedit";
import Sidebar from "./Sidebar";
import MaybeshowNavbar from "./MaybeshowNavbar";
import Servicenave from './Servicenave';

const App = () => {
  return (
    <BrowserRouter>
      <MaybeshowNavbar>
        <Servicenave />
        <Sidebar />
      </MaybeshowNavbar>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/Dashboard" element={<Dashboard />} />
        <Route exact path="/Addrvices" element={<Addrvices />} />
        <Route exact path="/Servicelist" element={<Servicelist />} />
        <Route exact path="/EditServiceForm/:id" element={<EditServiceForm />} />
        <Route exact path="/Testimonial" element={<Testimonial />} />
        <Route exact path="/Testimonial_List" element={<Testimonial_List />} />
        <Route exact path="/Testimonialedit/:id" element={<Testimonialedit />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


