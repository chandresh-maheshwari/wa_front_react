import { React, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AddPackage from "./AddPackage";
import PackageList from "./PackageList";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import EditClientForm from "./EditClientForm";
import EditPackages from "./EditPackages";
import Searchbar from "./Searchbar";

const App = () => {
  // const [isSidebarOpen, setSidebarOpen] = useState(false);

  // const toggleSidebar = (isOpen) => {
  //   setSidebarOpen(isOpen);

  //   // console.log(isSidebarOpen);
  // };
  return (
    <>
      <BrowserRouter>
        <div className="wrapper">
          <Searchbar />
          <Sidebar />
          <Routes>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/add_package" element={<AddPackage />} />
            <Route path="/package_list" element={<PackageList />} />
            <Route path="edit_client/:id" element={<EditPackages />} />
            <Route path="/add_client" element={<ClientForm />} />
            <Route path="/clist" element={<ClientList />} />
            <Route path="editform/:id" element={<EditClientForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
