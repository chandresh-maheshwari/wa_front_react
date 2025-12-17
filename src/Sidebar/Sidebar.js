import React, { useState, useEffect, useCallback } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import '../App.css';
import '../Custom.css';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import Authapi from '../Authapi';
import Config from '../Config';
import { useNavigate, useLocation } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
// import img from './images/WasteAccountant_LOGO.png'
// const img = `https://laravel.wasteaccountant.com/images/WasteAccountant_LOGO.png`;
// const img = `https://laravel.wasteaccountant.com/admin/images/profile_bkp.png`;
const img = `${Config.apiurl}images/profile_bkp.png`;

// const img = `https://front.wasteaccountant.com/images/page/WasteAccountant_LOGO.png`;



const Sidebar = () => {
  const [postTitles, setPostTitles] = useState([]);
  const [openItems, setOpenItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchedPosts, setHasFetchedPosts] = useState(false);
  const [userTypeEmail, setuserTypeEmail] = useState(null);

  const [, forceUpdate] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setuserTypeEmail(parsedUser.email);
        }
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
    }
  }, []);

  const fetchPostTitles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await Authapi.dynamicListData();

      if (response && response.results) {
        const activePosts = response.results.filter(post => post.status === 1 && post.deleted_at === 0);

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
  }, []);

  // Fetch only when the "All Posts" dropdown is opened for the first time.
  useEffect(() => {
    if (openItems['Dynamic_POSTS'] && !hasFetchedPosts) {
      fetchPostTitles().then(() => setHasFetchedPosts(true));
    }
  }, [openItems, hasFetchedPosts, fetchPostTitles]);

  // Refresh when post status change events fire (e.g., after edits).
  useEffect(() => {
    const handlePostStatusChange = async () => {
      await fetchPostTitles();
      setHasFetchedPosts(true);
    };

    window.addEventListener('dynamicPostStatusChanged', handlePostStatusChange);

    return () => {
      window.removeEventListener('dynamicPostStatusChanged', handlePostStatusChange);
    };
  }, [fetchPostTitles]);

  // Close All Posts dropdown when navigating away from post routes
  useEffect(() => {
    const isAllPostsRoute = location.pathname.startsWith('/post');
    if (!isAllPostsRoute) {
      setOpenItems((prev) => {
        if (!prev['Dynamic_POSTS'] && Object.keys(prev).every(key => typeof key === 'string')) {
          return prev;
        }
        const next = { ...prev, Dynamic_POSTS: false };
        postTitles.forEach((post) => {
          if (next[post.id]) {
            next[post.id] = false;
          }
        });
        return next;
      });
    }
  }, [location.pathname, postTitles]);

  const toggle = (id) => {
    setOpenItems((prevState) => {
      const newState = { ...prevState };
      const topLevel = ['Dynamic_POST', 'Dynamic_POSTS', 'page'];
      const isTopLevel = topLevel.includes(id);
      const isPostChild = !isNaN(id);

      if (isTopLevel) {
        // Close other top-level dropdowns
        topLevel.forEach((item) => {
          if (item !== id) newState[item] = false;
        });

        // When leaving All Posts, close child posts; when entering other menus, keep All Posts children closed
        if (id !== 'Dynamic_POSTS') {
          postTitles.forEach((post) => {
            newState[post.id] = false;
          });
        }

        newState[id] = !prevState[id];
        return newState;
      }

      if (isPostChild) {
        // Keep All Posts open, toggle only one child at a time
        newState['Dynamic_POSTS'] = true;
        postTitles.forEach((post) => {
          if (post.id !== id) newState[post.id] = false;
        });
        newState[id] = !prevState[id];
        return newState;
      }

      // Fallback toggle
      newState[id] = !prevState[id];
      return newState;
    });
  };

  const isActive = (id) => {
    const active = openItems[id];
    // console.log('Checking active state for:', id, 'Active:', active);
    return active || window.location.pathname === id;
  };

  const isPathActive = (path) => location.pathname.startsWith(path);

  const isDynamicPostLinkActive = (path) => isPathActive(path);

  const isPageAddActive = () => location.pathname === '/page';
  const isPageListActive = () => location.pathname === '/page-list';

  const isContactLinkActive = (path) => isPathActive(path);

  const isPostChildActive = (post, targetPath) => {
    const onTargetPath = isPathActive(targetPath);
    const stateTitle = location.state && location.state.post_title;
    if (!onTargetPath) return false;
    // If state is provided, match it; otherwise just rely on path
    if (stateTitle) {
      return stateTitle === post.post_title;
    }
    return true;
  };

  const linkStyle = (active) => (active ? activeStyle : {});

  // Auto-open the relevant dropdowns based on current route
  useEffect(() => {
    const path = location.pathname;
    const stateTitle = location.state && location.state.post_title;

    setOpenItems((prev) => {
      const next = { ...prev };
      const openTopLevel = (key) => {
        ['Dynamic_POST', 'Dynamic_POSTS', 'page'].forEach((item) => {
          next[item] = item === key;
        });
      };

      // Dynamic Post Type (Add/List)
      if (path.startsWith('/dynamic-form') || path.startsWith('/dynamic-list-data')) {
        openTopLevel('Dynamic_POST');
        return next;
      }

      // Page (Add/List)
      if (path.startsWith('/page')) {
        openTopLevel('page');
        return next;
      }
      if (path.startsWith('/page-list')) {
        openTopLevel('page');
        return next;
      }

      // Posts under All Posts
      if (path.startsWith('/post-form') || path.startsWith('/post-list')) {
        openTopLevel('Dynamic_POSTS');

        if (stateTitle && postTitles.length > 0) {
          const match = postTitles.find((p) => p.post_title === stateTitle);
          if (match) {
            postTitles.forEach((p) => {
              next[p.id] = p.id === match.id;
            });
          }
        }

        return next;
      }

      return next;
    });
  }, [location.pathname, location.state, postTitles]);

  const closeAllDropdowns = useCallback(() => {
    setOpenItems({});
  }, []);

  const activeStyle = {
    backgroundColor: 'rgba(72, 173, 59, 0.16)',
    color: '#ffffff',
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
      <div className="logo sidebar-brand">
        <img src={img} className="sidebar-logo" alt="Waste Accountant" />
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Waste Accountant</span>
          <span className="sidebar-brand-tagline">IT Admin Console</span>
        </div>
      </div>

      <div className="sidebar-wrapper" id="navigation">
        {userTypeEmail && (
          <div className="sidebar-user-chip">
            <span className="sidebar-user-avatar">
              {userTypeEmail.charAt(0).toUpperCase()}
            </span>
            <div className="sidebar-user-info">
              <span className="sidebar-user-label">Signed in</span>
              <span className="sidebar-user-email">{userTypeEmail}</span>
            </div>
          </div>
        )}

        <ul className="nav sidebar-menu">

          {/* <li className="nav-section-label">Overview</li> */}

          <li className={`nav-item nav-dropdown ${isActive('/Dashboard') ? 'active-sidebar-item' : ''}`}>
            <Link to="/Dashboard" className="nav-link dashboard-link">
              <p className="dashboard_nav_item">Dashboard</p>
            </Link>
          </li>
          {console.log("User Type:", userTypeEmail)}

          {userTypeEmail === "admindevloper@cms.com" && (
            <>
              {/* <li className="nav-section-label">CMS Management</li> */}

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
                  Dynamic Post Type
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
                    <Link
                      className={`nav-link ${isDynamicPostLinkActive('/dynamic-form') ? 'active-sidebar-item' : ''}`}
                      to="/dynamic-form"
                      style={linkStyle(isDynamicPostLinkActive('/dynamic-form'))}
                    >
                      <span>Add New </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isDynamicPostLinkActive('/dynamic-list-data') ? 'active-sidebar-item' : ''}`}
                      id="listing"
                      to="/dynamic-list-data"
                      style={linkStyle(isDynamicPostLinkActive('/dynamic-list-data'))}
                    >
                      <span>List</span>
                    </Link>
                  </li>
                </ul>
              )}
            </>
          )}

          {/* <li className="nav-section-label">Content</li> */}

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
                        <Link
                          className={`nav-link ${isPostChildActive(post, '/post-form') ? 'active-sidebar-item' : ''}`}
                          to="/post-form"
                          state={{ post_title: post.post_title }}
                          style={linkStyle(isPostChildActive(post, '/post-form'))}
                        >
                          <span>Add New</span>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${isPostChildActive(post, '/post-list') ? 'active-sidebar-item' : ''}`}
                          id="listing"
                          to="/post-list"
                          state={{ post_title: post.post_title }}
                          style={linkStyle(isPostChildActive(post, '/post-list'))}
                        >
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
                <Link
                  className={`nav-link ${isPageAddActive() ? 'active-sidebar-item' : ''}`}
                  to="/page"
                  style={linkStyle(isPageAddActive())}
                >
                  <span>Add New</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isPageListActive() ? 'active-sidebar-item' : ''}`}
                  id="listing"
                  to="/page-list"
                  style={linkStyle(isPageListActive())}
                >
                  <span>Page List</span>
                </Link>
              </li>
            </ul>
          )}

          {/* <li className="nav-section-label">Other</li> */}

          <li className="nav-item nav-dropdown mt-2">
            <Link
              className="nav-link contact-us"
              id="listing"
              to="/Contact-listing"
              onClick={closeAllDropdowns}
              style={linkStyle(isContactLinkActive('/Contact-listing'))}
              >
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
