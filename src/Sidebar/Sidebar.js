import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import '../App.css';
import '../Custom.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Authapi from '../Authapi';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
// import img from './images/WasteAccountant_LOGO.png'
// const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;
const img = `https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png`;

// const img = `https://front.wasteaccountant.com/images/page/WasteAccountant_LOGO.png`;



const Sidebar = () => {
  const [postTitles, setPostTitles] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [, forceUpdate] = useState();

    const navigate = useNavigate();
  useEffect(() => {
    const fetchPostTitles = async () => {
      try {
        setIsLoading(true);
        const response = await Authapi.dynamicListData();

        if (response && response.results) {
          const activePosts = response.results.filter(post => post.deleted_at === 0 && post.status === 1);

          activePosts.sort((a, b) => {
            if (a.ordering === b.ordering) {
              return b.id - a.id;
            }
            return a.ordering - b.ordering;
          });

          setPostTitles(activePosts);
          forceUpdate({});
        }
      } catch (error) {
        console.error('Error fetching post titles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostTitles();

    const handlePostStatusChange = async (event) => {
      const { id, status } = event.detail;

      try {
        const response = await Authapi.dynamicListData();
        if (response && response.results) {
          const activePosts = response.results.filter(post => post.deleted_at === 0 && post.status === 1);

          activePosts.sort((a, b) => {
            if (a.ordering === b.ordering) {
              return b.id - a.id;
            }
            return a.ordering - b.ordering;
          });

          setPostTitles(activePosts);
        }
      } catch (error) {
        console.error('Error refetching post titles:', error);
      }
    };

    window.addEventListener('dynamicPostStatusChanged', handlePostStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('dynamicPostStatusChanged', handlePostStatusChange);
    };
  }, []);

  const toggle = (id) => {
    setOpenItems(prevState => {
      const newState = { ...prevState };
      if (id === 'Dynamic_POSTS') {
        newState[id] = !prevState[id]; // Toggle the main dropdown
      } else {
        Object.keys(newState).forEach(key => {
          if (key !== 'Dynamic_POSTS') {
            newState[key] = false; // Close all post items
          }
        });
        newState[id] = !prevState[id]; // Toggle the current post item
      }
      return newState;
    });
  };

  const isActive = (id) => {
    const active = openItems[id];
    // console.log('Checking active state for:', id, 'Active:', active);
    return active || window.location.pathname === id;
  };

  const activeStyle = {
    backgroundColor: '#f0f0f0',
    color: '#333',
  };

 const logoutData = async () => {
        try {

            // // const response = await Authapi.logoutData();
            // // console.log(response)
            // localStorage.removeItem('Token');
            // localStorage.removeItem('user');

            const response = await Authapi.logoutData();
            // console.log(response)
            if (response.status === true) {

                localStorage.removeItem('Token');
                localStorage.removeItem('user');
                navigate('/');
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };




  return (
    <div className="sidebar" data-color="orange">
      <div className="logo">
        <img src={img} style={{ width: "100%" }} alt="img" />
      </div>
      <div className="sidebar-wrapper" id="navigation">
        <ul className="nav">

          <li className={`nav-item nav-dropdown ${isActive('/Dashboard') ? 'active-sidebar-item' : ''}`}>
            <Link to="/Dashboard">
              <p>Dashboard</p>
            </Link>
          </li>          <li>
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
              Dynamic post
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
                  <span>Add New </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link " id="listing" to="/dynamic-list-data">
                  <span>Dynamic post List</span>
                </Link>
              </li>
            </ul>
          )}

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
                        <Link className="nav-link " id="listing" to="/post-list" state={{ post_title: post.post_title }}>
                          <span>Post List</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

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
                <Link className="nav-link  " id="listing" to="/page-list">
                  <span>Page List</span>
                </Link>
              </li>
            </ul>
          )}

          <li className="nav-item nav-dropdown mt-2">
            <Link
              className="nav-link contact-us"
              id="listing"
              to="/Contact-listing">
              <p>Contact List</p>
            </Link>
          </li>

          <li className="logout nav-item nav-dropdown mt-2">
            <Link
              className="nav-link logout"
              onClick={logoutData} 
              to="/">                        
              
              <p><CiLogout /> Logout</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};


export default Sidebar;
