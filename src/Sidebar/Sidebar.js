import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import '../App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Authapi from '../Authapi';
const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;
$(document).ready(function () {

  // $(document).delegate('#product', 'click', function () {
  //   $(".nav-dropdown-items").toggle();
  // });

  // $(document).delegate('#promotion', 'click', function () {
  //   $(".nav-dropdown-items-promotion").toggle();
  // });

  // $(document).delegate('#testimonial', 'click', function () {
  //   $(".nav-dropdown-items-testimonial").toggle();
  // });

  // $(document).delegate('#client', 'click', function () {
  //   $(".nav-dropdown-items-client").toggle();
  // });

  // $(document).delegate('#navbar', 'click', function () {
  //   $(".nav-dropdown-items-navbar").toggle();
  // });
  // $(document).delegate('#home', 'click', function () {
  //   $(".nav-dropdown-items-home").toggle();

  // });
  // $(document).delegate('#producer', 'click', function () {
  //   $(".nav-dropdown-items-producer").toggle();

  // });
  // $(document).delegate('#Quote', 'click', function () {
  //   $(".nav-dropdown-items-Quote").toggle();

  // });
  // $(document).delegate('#Waste', 'click', function () {
  //   $(".nav-dropdown-items-Waste").toggle();

  // });
  // $(document).delegate('#Improve', 'click', function () {
  //   $(".nav-dropdown-items-Improve").toggle();

  // });
  $(document).delegate('#POST', 'click', function () {
    $(".nav-dropdown-items-POST").toggle();

  });
  $(document).delegate('#Dynamic_POST', 'click', function () {
    $(".nav-dropdown-items-Dynamic_POST").toggle();
  });
  $(document).delegate('.dynamic-page-link', 'click', function () {
    const postId = $(this).data('post-id');
    $(`.nav-dropdown-items-dynamic_page-${postId}`).toggle();
  });

});

const Sidebar = () => {
  const [postTitles, setPostTitles] = useState([]);

  useEffect(() => {
    fetchPostTitles();

    const interval = setInterval(() => {
      fetchPostTitles();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPostTitles = async () => {
    try {
      const response = await Authapi.dynamicListData();
      if (response && response.results) {
        const activePosts = response.results.filter(post => post.status === 1);
        activePosts.sort((a, b) => {
          if (a.ordering === b.ordering) {
            return b.id - a.id;
          }
          return a.ordering - b.ordering;
        });
        setPostTitles(prevPosts => {
          const arePostsEqual = JSON.stringify(prevPosts) === JSON.stringify(activePosts);
          return arePostsEqual ? prevPosts : activePosts;
        });
      }
    } catch (error) {
      console.error('Error fetching post titles:', error);
    }
  };

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
            {/* <li className="nav-item nav-dropdown">
              <Link id="product" className="nav-link nav-dropdown-toggle" to="/topmenu">
                Top Menu
              </Link>

              <li className="nav-item nav-dropdown">
                <Link
                  id="navbar"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Navbar
                </Link>
                <ul className="nav-dropdown-items-navbar">
                  <li className="nav-item">
                    <Link className="nav-link" to="/Navbar">
                      <span> Add Navbar From </span>
                    </Link>
                    <Link className="nav-link" to="/NabarList" style={{ marginTop: "-12px" }}>
                      <span> Navbar List</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item nav-dropdown">
                <Link
                  id="home"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Home
                </Link>
                <ul className="nav-dropdown-items-home">
                  <li className="nav-item">
                    <Link className="nav-link" to="/home">
                      <span> Add Home From </span>
                    </Link>
                    <Link className="nav-link" to="/HomeList" style={{ marginTop: "-12px" }}>
                      <span> Home List</span>
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-item nav-dropdown">
                <Link
                  id="producer"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Reciver Producer Section
                </Link>
                <ul className="nav-dropdown-items-producer">
                  <li className="nav-item">
                    <Link className="nav-link" to="/ProducerForm">
                      <span> Add Producer From </span>
                    </Link>
                    <Link className="nav-link" to="/producerList" style={{ marginTop: "-12px" }}>
                      <span> producer List</span>
                    </Link>
                  </li>
                </ul>
              </li>



              <li className="nav-item nav-dropdown">
                <Link
                  id="Quote"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Quote Section
                </Link>
                <ul className="nav-dropdown-items-Quote">
                  <li className="nav-item">
                    <Link className="nav-link" to="/Quote">
                      <span> Add Quote From </span>
                    </Link>
                    <Link className="nav-link" to="/QuoteList" style={{ marginTop: "-12px" }}>
                      <span> producer List</span>
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-item nav-dropdown">
                <Link
                  id="Waste"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Choose Waste Accountant
                </Link>
                <ul className="nav-dropdown-items-Waste">
                  <li className="nav-item">
                    <Link className="nav-link" to="/Westacc">
                      <span> Add Waste Accountant From </span>
                    </Link>
                    <Link className="nav-link" to="/WasteList" style={{ marginTop: "-12px" }}>
                      <span> producer List</span>
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-item nav-dropdown">
                <Link
                  id="Improve"
                  className="nav-link nav-dropdown-toggle"
                  to="#"
                >
                  Improve Environmental Protections
                </Link>
                <ul className="nav-dropdown-items-Improve">
                  <li className="nav-item">
                    <Link className="nav-link" to="/Improve">
                      <span> Add Improve From </span>
                    </Link>
                    <Link className="nav-link" to="/ImproveList" style={{ marginTop: "-12px" }}>
                      <span> Improve List</span>
                    </Link>
                  </li>
                </ul>
              </li>

            </li> */}

            {/* <li className="nav-item nav-dropdown">
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
              <Link id="client" className="nav-link nav-dropdown-toggle" to="#">
                Client
              </Link>
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
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="#">
                <p>Users</p>
              </Link>
            </li> */}


            <li>
              <Link id="Dynamic_POST" className="nav-link nav-dropdown-toggle" to="#">
                Dynamic post
              </Link>
              <ul className="nav-dropdown-items-Dynamic_POST">
                <li className="nav-item">
                  <Link className="nav-link" to="/dynamic-form">
                    <span>Add New Form</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dynamic-list-data" style={{ marginTop: "-12px" }}>
                    <span>Dynamic post List</span>
                  </Link>
                </li>


              </ul>
            </li>


            {postTitles.map((post) => (
              <li key={post.id}>
                <li className="nav-item">
                  <Link
                    id="dynamic_page"
                    className="nav-link nav-dropdown-toggle dynamic-page-link"
                    data-post-id={post.id}
                    to="#"
                  >
                    <span>{post.post_title}</span>
                  </Link>
                </li>

                <ul className={`nav-dropdown-items-dynamic_page-${post.id}`} id="nav-dropdown-items-dynamic_page">

                  <li className="nav-item" key={post.post_title}>
                    <Link className="nav-link" to='/post-form' state={{ post_title: post.post_title }}>
                      <span>Add New Form</span>
                    </Link>
                  </li>
                  <li className="nav-item" key={post.post_title}>
                    {/* {console.log(post.post_title)} */}
                    <Link className="nav-link" to='/post-list' state={{ post_title: post.post_title }} >
                      <span>View All Post</span>
                    </Link>
                  </li>

                </ul>
              </li>
            ))}



            <li>
              <Link id="POST" className="nav-link nav-dropdown-toggle" to="#">
                page
              </Link>
              <ul className="nav-dropdown-items-POST">
                <li className="nav-item">
                  <Link className="nav-link" to="/Post" >
                    <span>Add New</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/PostList" style={{ marginTop: "-12px" }}>
                    <span>page  List</span>
                  </Link>
                </li>
              </ul>
            </li>



          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
