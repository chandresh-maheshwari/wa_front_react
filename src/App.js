/* eslint-disable react/jsx-pascal-case */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import "./App.css"
import "./Service/Addrvices.css";
// import Addrvices from "./Service/Addrvices";
// import Servicelist from "./Servicelist";
import Servicenave from "./Service/Servicenave";
// import Servicelist from "./Service/Servicelist"
import Login from "./Login/Login";
import ForgetPasswordForm from "./Login/ForgetPassword";
// import Testimonial from "./Testimonial/Testimonial";
// import Testimonial_List from "./Testimonial/Testimonial_List";
// import Testimonialedit from "./Testimonial/Testimonialedit";
// import ProducerForm from "./P_Reciver/P_Reciver";
import Sidebar from "./Sidebar/Sidebar";
import MaybeshowNavbar from "./MaybeshowNavbar";
// import EditServiceForm from "./Service/EditServiceForm";
// import Topmenu from "./Menu/TopMenu";
// import Navbar from "./Navbar/Navbar";
// import NavbarListData from "./Navbar/NabarList";
// import Home from "./Home/Home";
// import HomeListData from "./Home/HomeList";
// import Topmanuedit from "./Menu/TopMenuEdit";
// import NavbarEdit from "./Navbar/NavbarEdit";
// import HomeEditform from "./Home/Homeedit";
// import ReciversrEditForm from "./P_Reciver/ProducerReciverEdit";
// import Quote from "./Quote_section/Quote";
// import QuoteEditForm from "./Quote_section/QuoteEdit";
// import WestAccount from "./West_account/Westacc";
// import WestAccountEdit from "./West_account/westaccEdit";
// import ImpoveData from "./Improve_prodection/Improve";
// import ImpoveDataEdit from "./Improve_prodection/ImproveEdit";
// import ProducerList from "./P_Reciver/producerList";
// import QuoteList from "./Quote_section/QuoteList";
// import WestAccountList from "./West_account/WasteList";
// import ImpoveDataList from "./Improve_prodection/ImproveList";




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


const App = () => {
  return (
    <BrowserRouter>
      <MaybeshowNavbar>
        <Servicenave />
        <Sidebar />
      </MaybeshowNavbar>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/ForgetPassword" element={<ForgetPasswordForm />} />

        <Route exact path="/Dashboard" element={<Dashboard />} />
        {/* <Route exact path="/Addrvices" element={<Addrvices />} />
        <Route exact path="/Servicelist" element={<Servicelist />} />
        <Route exact path="/EditServiceForm/:id" element={<EditServiceForm />} />
        <Route exact path="/Testimonial" element={<Testimonial />} />
        <Route exact path="/Testimonial_List" element={<Testimonial_List />} />
        <Route exact path="/Testimonialedit/:id" element={<Testimonialedit />} />
        <Route exact path="/Topmenu" element={<Topmenu />} />
        <Route exact path="/Home" element={<Home />} />
        <Route exact path="/HomeList" element={<HomeListData />} />
        <Route exact path="/Navbar" element={<Navbar />} />
        <Route exact path="/NabarList" element={<NavbarListData />} />
        <Route exact path="/ProducerForm" element={<ProducerForm />} />
        <Route path="/Topmanuedit/:id" element={<Topmanuedit />} />
        <Route path="/NavbarEdit/:id" element={<NavbarEdit />} />
        <Route path="/HomeEditform/:id" element={<HomeEditform />} />
        <Route path="/ProducerReciverEdit/:id" element={<ReciversrEditForm />} />
        <Route exact path="/Quote" element={<Quote />} />
        <Route path="/QuoteEdit/:id" element={<QuoteEditForm />} />
        <Route exact path="/Westacc" element={<WestAccount />} />
        <Route path="/westaccEdit/:id" element={<WestAccountEdit />} />
        <Route exact path="/Improve" element={<ImpoveData />} />
        <Route path="/ImproveEdit/:id" element={<ImpoveDataEdit />} />
        <Route exact path="/producerList" element={<ProducerList />} />
        <Route exact path="/QuoteList" element={<QuoteList />} />
        <Route exact path="/WasteList" element={<WestAccountList />} />
        <Route exact path="/ImproveList" element={<ImpoveDataList />} /> */}


        <Route exact path="/dynamic-form" element={<Dynamicform />} />
        <Route exact path="/dynamic-list-data" element={<DynamicList />} />
        <Route path="/dynamic-edit/:id" element={<DynamicEditForm />} />
        <Route path="/post-form" element={<PostFormDynamic />} />
        <Route exact path="/post-list" element={<PostDynamicList />} />
        <Route path="/post-edit/:id" element={<PostDynamicEdit />} />

        <Route path="/Page" element={<Page />} />
        <Route exact path="/Page-list" element={<PageList />} />

        <Route path="/Page-edit/:id" element={<PageEdit />} />
        <Route exact path="/Contact-listing" element={<Contact />} />








      </Routes>
    </BrowserRouter>
  );
};

export default App;


