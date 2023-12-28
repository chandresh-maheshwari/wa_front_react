import React, { useState } from "react";
// import { FaBars } from "react-icons/fa";

import $ from "jquery";
import { Link } from "react-router-dom";
// import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Searchbar from "./Searchbar";

const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;

// $(document).ready(function () {
//   $("#product").click(function () {
//     $(".nav-dropdown-items").toggle();
//   });

//   $("#promotion").click(function () {
//     $(".nav-dropdown-items-promotion").toggle();
//   });
//   $("#testimonial").click(function () {
//     $(".nav-dropdown-items-testimonial").toggle();
//   });
//   $("#client").click(function () {
//     $(".nav-dropdown-items-client").toggle();
//   });
// });

$(document).ready(function () {
  $(document).on("click", "#product", function () {
    $(".nav-dropdown-items").toggle();
  });
  $(document).on("click", "#client", function () {
    $(".nav-dropdown-items-client").toggle();
  });
});

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <div
        className={`sidebar ${isOpen ? "open" : "closed"}`}
        data-color="orange"
      >
        <div className="logo">
          <img src={img} width={200} alt="img" />
        </div>
        <div className="sidebar-wrapper ps ps--active-y" id="sidebar-wrapper">
          <ul className="nav" style={{ display: "block" }}>
            <li className="nav-item nav-dropdown">
              <Link to="/dash">
                <i className="now-ui-icons"></i>
                <p>Dashboard</p>
                {/* <i class="fa fa-bars"></i> */}
              </Link>
            </li>
            <li className="nav-item nav-dropdown">
              <a id="product" className="nav-link" href="#">
                <i className="nav-icon la la-group"></i>Package
              </a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_package">
                    <i className="nav-icon la la-user"></i>
                    <span>Add Package</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/package_list">
                    <i className="nav-icon la la-group"></i>
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
                <i className="nav-icon la la-group"></i>Services
              </a>
              <ul className="nav-dropdown-items-promotion">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_service">
                    <i className="nav-icon la la-user"></i>
                    <span>Add Services</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/services">
                    <i className="nav-icon la la-group"></i>
                    <span>Services List</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <a id="client" className="nav-link nav-dropdown-toggle" href="#">
                <i className="nav-icon la la-group"></i>Client
              </a>
              <ul className="nav-dropdown-items-client">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_client">
                    <i className="#"></i> <span>Add client</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clist">
                    <i className="#"></i> <span>Client List</span>
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
                <i className="nav-icon la la-group"></i>Testimonials
              </a>
              <ul className="nav-dropdown-items-testimonial">
                <li className="nav-item">
                  <Link className="nav-link" to="/testimonial">
                    <i className="#"></i> <span>Add Testimonial </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/testimonial_list">
                    <i className="#"></i> <span>Testimonial List</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/notifications.html">
                <p>Products</p>
              </Link>
            </li>
            <li>
              <Link to="/typography.html">
                <p>Users</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
