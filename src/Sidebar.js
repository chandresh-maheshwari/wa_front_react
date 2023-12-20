import React from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;
$(document).ready(function () {

    $(document).delegate('#product', 'click', function () { 
    $(".nav-dropdown-items").toggle();
  });

  $(document).delegate('#promotion', 'click', function () { 
    $(".nav-dropdown-items-promotion").toggle();
  });

    $(document).delegate('#testimonial', 'click', function () { 
    $(".nav-dropdown-items-testimonial").toggle();
  });

    $(document).delegate('#client', 'click', function () { 
    $(".nav-dropdown-items-client").toggle();
  });
});

const Sidebar = () => {
  
  return (
    <>

      <div className="sidebar" data-color="orange">
        <div className="logo">
          <img src={img} style={{ width: "100%" }} alt="img" />
        </div>
        <div className="sidebar-wrapper" id="sidebar-wrapper">
          <ul className="nav">

            <li className="nav-item nav-dropdown">
              <Link to="/Dashboard">
                <p>Dashboard</p>
              </Link>
            </li>

            <li className="nav-item nav-dropdown">
              <a id="product" className="nav-link nav-dropdown-toggle" href="#">
                Package
              </a>

              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <span>Add Package</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">
                    <span>Package List</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item nav-dropdown">
              <a
                id="promotion"
                className="nav-link nav-dropdown-toggle"
                href="#"
              >
                Services
              </a>
              <ul className="nav-dropdown-items-promotion">
                <li className="nav-item">
                  <Link className="nav-link" to="/Addrvices">
                    <span>Add Services</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Servicelist">
                    <span>Services List</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a id="client" className="nav-link nav-dropdown-toggle" href="#">
                Client
              </a>
              <ul className="nav-dropdown-items-client">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_client">
                    <span>Add client</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clist">
                    <span>Client List</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item nav-dropdown">
              <a
                id="testimonial"
                className="nav-link nav-dropdown-toggle"
                href="#"
              >
                Testimonials
              </a>
              <ul className="nav-dropdown-items-testimonial">
                <li className="nav-item">
                  <Link className="nav-link" to="/Testimonial">
                    <span>Add Testimonial </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Testimonial_List">
                    <span>Testimonial List</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <a href="#">
                <p>Products</p>
              </a>
            </li>

            <li>
              <a href="#">
                <p>Users</p>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
