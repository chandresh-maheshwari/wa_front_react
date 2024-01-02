<<<<<<< HEAD
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
=======
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
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
    $(".nav-dropdown-items-client").toggle();
  });
});

<<<<<<< HEAD
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
=======
const Sidebar = () => {

  return (
    <>

      <div className="sidebar" data-color="orange">
        <div className="logo">
          <img src={img} style={{ width: "100%" }} alt="img" />
        </div>
        <div className="sidebar-wrapper" id="navigation">
          <ul className="nav">

            <li className="nav-item nav-dropdown">
              <Link to="/Dashboard">
                <p>Dashboard</p>
              </Link>
            </li>

            <li className="nav-item nav-dropdown">
              <Link id="product" className="nav-link nav-dropdown-toggle" to="#">
                Package
              </Link>

              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link className="nav-link" to="#">
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                    <span>Add Package</span>
                  </Link>
                </li>
                <li className="nav-item">
<<<<<<< HEAD
                  <Link className="nav-link" to="/package_list">
                    <i className="nav-icon la la-group"></i>
=======
                  <Link className="nav-link" to="#">
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                    <span>Package List</span>
                  </Link>
                </li>
              </ul>
            </li>
<<<<<<< HEAD
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
=======

            <li className="nav-item nav-dropdown">
              <Link
                id="promotion"
                className="nav-link nav-dropdown-toggle"
                to="#"
              >
                Services
              </Link>
              <ul className="nav-dropdown-items-promotion">
                <li className="nav-item">
                  <Link className="nav-link" to="/Addrvices">
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                    <span>Add Services</span>
                  </Link>
                </li>
                <li className="nav-item">
<<<<<<< HEAD
                  <Link className="nav-link" to="/services">
                    <i className="nav-icon la la-group"></i>
=======
                  <Link className="nav-link" to="/Servicelist">
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                    <span>Services List</span>
                  </Link>
                </li>
              </ul>
            </li>
<<<<<<< HEAD
            <li>
              <a id="client" className="nav-link nav-dropdown-toggle" href="#">
                <i className="nav-icon la la-group"></i>Client
              </a>
              <ul className="nav-dropdown-items-client">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_client">
                    <i className="#"></i> <span>Add client</span>
=======

            <li>
              <Link id="client" className="nav-link nav-dropdown-toggle" to="#">
                Client
              </Link>
              <ul className="nav-dropdown-items-client">
                <li className="nav-item">
                  <Link className="nav-link" to="/add_client">
                    <span>Add client</span>
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clist">
<<<<<<< HEAD
                    <i className="#"></i> <span>Client List</span>
=======
                    <span>Client List</span>
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                  </Link>
                </li>
              </ul>
            </li>
<<<<<<< HEAD
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
=======

            <li className="nav-item nav-dropdown">
              <Link
                id="testimonial"
                className="nav-link nav-dropdown-toggle"
                to="#"
              >
                Testimonials
              </Link>
              <ul className="nav-dropdown-items-testimonial">
                <li className="nav-item">
                  <Link className="nav-link" to="/Testimonial">
                    <span>Add Testimonial </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Testimonial_List">
                    <span>Testimonial List</span>
>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
                  </Link>
                </li>
              </ul>
            </li>
<<<<<<< HEAD
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
=======

            <li>
              <Link to="#">
                <p>Products</p>
              </Link>
            </li>

            <li>
              <Link to="#">
                <p>Users</p>
              </Link>
            </li>

>>>>>>> 9127131cedcf72c17dd75eb0356aaef9d1ed0e24
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
