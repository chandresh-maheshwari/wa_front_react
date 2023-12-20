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

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Addrvices" element={<Addrvices />} />
          <Route path="/Servicelist" element={<Servicelist />} />
          <Route path="/EditServiceForm/:id" element={<EditServiceForm />} />
          <Route path="/Testimonial" element={<Testimonial />} />
          <Route path="/Testimonial_List" element={<Testimonial_List />} />
          <Route path="/Testimonialedit/:id" element={<Testimonialedit />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;


