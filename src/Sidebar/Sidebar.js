import React, { useState, useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import '../App.css';
import '../Custom.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Authapi from '../Authapi';
// import img from './images/WasteAccountant_LOGO.png'
// const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;
const img = `https://laravel.wasteaccountant.com/admin/images/WasteAccountant_LOGO.png`;

// const img = `https://front.wasteaccountant.com/images/page/WasteAccountant_LOGO.png`;



const Sidebar = () => {
  const [postTitles, setPostTitles] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [, forceUpdate] = useState();

  useEffect(() => {
    const fetchPostTitles = async () => {
      try {
        setIsLoading(true);
        const response = await Authapi.dynamicListData();

        if (response && response.results) {
          const activePosts = response.results.filter(post => post.status === 1);

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
          const activePosts = response.results.filter(post => post.status === 1);

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
    setOpenItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
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


          <li>
            <li className="nav-item nav-dropdown">
              <Link
                id="Dynamic_POST"
                className="nav-link nav-dropdown-toggle"
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
                    <span>Add New Form</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link " id="listing" to="/dynamic-list-data">
                    <span>Dynamic post List</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>


          {postTitles.length > 0 && postTitles.map((post) => (
            <li key={post.id}>
              <li className="nav-item">
                <Link
                  id={`dynamic_page_${post.id}`}
                  className="nav-link nav-dropdown-toggle dynamic-page-link"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(post.id);
                  }}
                >
                  <span>{post.post_title}</span>
                  {openItems[post.id] ? (
                    <IoIosArrowUp className="Arrow-icon-Sidebar" />
                  ) : (
                    <IoIosArrowDown className="Arrow-icon-Sidebar" />
                  )}
                </Link>
              </li>
              {openItems[post.id] && (
                <ul className={`nav-dropdown-items-dynamic_page-${post.id}`} id="nav-dropdown-items-dynamic_page">
                  <li className="nav-item">
                    <Link className="nav-link" to="/post-form" state={{ post_title: post.post_title }}>
                      <span>Add New Form</span>
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


          <li>
            <li className="nav-item nav-dropdown">
              <Link
                id="Page"
                className="nav-link nav-dropdown-toggle"
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
          </li>




          <li className="nav-item nav-dropdown">
            <Link className="nav-link  " id="listing" to="/Contact-listing">
              <p>Contact List</p>
            </Link>
          </li>







        </ul>
      </div>
    </div>











  );
};


export default Sidebar;
