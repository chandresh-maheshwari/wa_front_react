import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { CiLogout } from "react-icons/ci";
import Authapi from '../Authapi';
import '../App.css';
import '../Custom.css';

const Sidebar = () => {
  const [postTitles, setPostTitles] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('Token');
      setIsAuthenticated(!!token); // If there's a token, user is authenticated
    };
    checkAuthentication();
  }, []);

  const logoutData = async () => {
    try {
      setIsLoggingOut(true); // Set loading state

      const response = await Authapi.logoutData();
      if (response.status === true) {
        // Clear local storage and reset necessary states
        localStorage.removeItem('Token');
        localStorage.removeItem('user');

        // Reset the state
        setPostTitles([]);
        setOpenItems({});
        setIsAuthenticated(false); // Update auth state to false

        // Delay navigation to avoid flickering
        setTimeout(() => {
          navigate('/', { replace: true }); // Using replace to avoid back button navigation to the previous state
        }, 500); // Adding a small delay (500ms)
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoggingOut(false); // Reset loading state
    }
  };

  // If the user is not authenticated, redirect immediately
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Handle sidebar toggles
  const toggle = (id) => {
    setOpenItems(prevState => {
      const newState = { ...prevState };

      // Close the other dropdowns when one is toggled
      if (id === 'Dynamic_POSTS') {
        newState['Dynamic_POST'] = false;
        newState['page'] = false;
      } else if (id === 'Dynamic_POST') {
        newState['Dynamic_POSTS'] = false;
        newState['page'] = false;
      } else if (id === 'page') {
        newState['Dynamic_POSTS'] = false;
        newState['Dynamic_POST'] = false;
      }

      newState[id] = !prevState[id];
      return newState;
    });
  };

  const isActive = (id) => {
    const active = openItems[id];
    return active || window.location.pathname === id;
  };

  const activeStyle = {
    backgroundColor: '#f0f0f0',
    color: '#333',
  };

  return (
    <div className="sidebar" data-color="orange">
      {isLoggingOut && <div className="loading-spinner">Logging out...</div>}
      <div className="logo">
        <img src="https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png" style={{ width: "100%" }} alt="img" />
      </div>
      <div className="sidebar-wrapper" id="navigation">
        <ul className="nav">

          <li className={`nav-item nav-dropdown ${isActive('/Dashboard') ? 'active-sidebar-item' : ''}`}>
            <Link to="/Dashboard">
              <p>Dashboard</p>
            </Link>
          </li>

          {/* Dynamic POST dropdown */}
          <li>
            <Link
              id="Dynamic_POST"
              className={`nav-link nav-dropdown-toggle nav-item nav-dropdown ${isActive('Dynamic_POST') ? 'active-sidebar-item' : ''}`}
              style={{ ...isActive('Dynamic_POST') ? activeStyle : {}, display: 'flex', alignItems: 'center' }}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                toggle('Dynamic_POST');
              }}
            >
              Dynamic Post
              {openItems['Dynamic_POST'] ? (
                <IoIosArrowUp className="Arrow-icon-Sidebar" />
              ) : (
                <IoIosArrowDown className="Arrow-icon-Sidebar" />
              )}
            </Link>
          </li>

          {openItems['Dynamic_POST'] && (
            <ul className="nav-dropdown-items-Dynamic_POST">
              <li className="nav-item">
                <Link className="nav-link" to="/dynamic-form">
                  <span>Add New</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="listing" to="/dynamic-list-data">
                  <span>Dynamic Post List</span>
                </Link>
              </li>
            </ul>
          )}

          {/* All Posts dropdown */}
          <li>
            <Link
              id="Dynamic_POSTS"
              className={`nav-link nav-dropdown-toggle nav-item nav-dropdown mb-2 ${isActive('Dynamic_POSTS') ? 'active-sidebar-item' : ''}`}
              style={{ ...isActive('Dynamic_POSTS') ? activeStyle : {}, display: 'flex', alignItems: 'center' }}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                toggle('Dynamic_POSTS');
              }}
            >
              All Posts
              {openItems['Dynamic_POSTS'] ? (
                <IoIosArrowUp className="Arrow-icon-Sidebar" />
              ) : (
                <IoIosArrowDown className="Arrow-icon-Sidebar" />
              )}
            </Link>
          </li>

          {openItems['Dynamic_POSTS'] && (
            <ul className="nav-dropdown-items-Dynamic_POSTS">
              {postTitles.length > 0 && postTitles.map((post) => (
                <li key={post.id}>
                  <Link
                    id={`dynamic_page_${post.id}`}
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(post.id);
                    }}
                    className={`nav-link nav-dropdown-toggle dynamic-page-link nav-item ${isActive(post.id) ? 'active-sidebar-item' : ''}`}
                    style={{ ...isActive(post.id) ? activeStyle : {}, display: 'flex', alignItems: 'center' }}
                  >
                    <span>{post.post_title}</span>
                    {openItems[post.id] ? (
                      <IoIosArrowUp className="Arrow-icon-Sidebar" />
                    ) : (
                      <IoIosArrowDown className="Arrow-icon-Sidebar" />
                    )}
                  </Link>
                  {openItems[post.id] && (
                    <ul className={`nav-dropdown-items-dynamic_page-${post.id}`} id="nav-dropdown-items-dynamic_page">
                      <li className="nav-item">
                        <Link className="nav-link" to="/post-form" state={{ post_title: post.post_title }}>
                          <span>Add New</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" id="listing" to="/post-list" state={{ post_title: post.post_title }}>
                          <span>Post List</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Page dropdown */}
          <li>
            <Link
              id="Page"
              className={`nav-link nav-dropdown-toggle nav-item nav-dropdown ${isActive('page') ? 'active-sidebar-item' : ''}`}
              style={{ ...isActive('page') ? activeStyle : {}, display: 'flex', alignItems: 'center' }}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                toggle('page');
              }}
            >
              Page
              {openItems['page'] ? (
                <IoIosArrowUp className="Arrow-icon-Sidebar" />
              ) : (
                <IoIosArrowDown className="Arrow-icon-Sidebar" />
              )}
            </Link>
          </li>

          {openItems['page'] && (
            <ul className="nav-dropdown-items-Page">
              <li className="nav-item">
                <Link className="nav-link" to="/page">
                  <span>Add New</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="listing" to="/page-list">
                  <span>Page List</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Contact List */}
          <li className="nav-item nav-dropdown mt-2">
            <Link className="nav-link contact-us" id="listing" to="/Contact-listing">
              <p>Contact List</p>
            </Link>
          </li>

          {/* Logout */}
          <li className="logout nav-item nav-dropdown mt-2">
            <Link className="nav-link logout" onClick={logoutData} to="#">
              <p><CiLogout /> Logout</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
