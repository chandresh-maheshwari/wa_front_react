import { React, useEffect, useState } from "react";
import "./Searchbar.css";
import $ from "jquery";

import { PiWaveformFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import { TiWorld } from "react-icons/ti";
import Sidebar from "./Sidebar";

const Searchbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Add event listener for window resize to check if sidebar should be open or closed
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 991);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize sidebar state based on screen width

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (   
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-10">
            <nav className="navbar navbar-expand-lg  bg-primary  navbar-absolute">
              <div className="container-fluid">
                <div className="navbar-wrapper">
                  <div className="navbar-toggle">
                    <button type="button" className="navbar-toggler">
                      <span className="navbar-toggler-bar bar1"></span>
                      <span className="navbar-toggler-bar bar2"></span>
                      <span className="navbar-toggler-bar bar3"></span>
                    </button>
                  </div>
                  <a class="navbar-brand" href="#pablo"></a>
                </div>
                <button
                  className="navbar-toggler"
                  type="button"
                  aria-label="Toggle navigation"
                  onClick={handleToggleSidebar}
                >
                  {/* <FaBars/> */}
                  <span className="navbar-toggler-bar navbar-kebab"></span>
                  <span className="navbar-toggler-bar navbar-kebab"></span>
                  <span className="navbar-toggler-bar navbar-kebab"></span>
                </button>
                <Sidebar isOpen={isSidebarOpen} />
                {/* <FaBars
                  // type="button"
                  className="navbar-toggler"
                  onClick={handleToggle}
                  style={{
                    position: "absolute",
                    backgroundColor: "transperent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // marginLeft: "250px",
                  }}
                ></FaBars> */}

                <div
                  className="collapse navbar-collapse justify-content-end"
                  id="navigation"
                >
                  <form>
                    <div className="input-group no-border">
                      <input
                        type="text"
                        value=""
                        className="form-control"
                        placeholder="Search..."
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <i className="now-ui-icons ui-1_zoom-bold">
                            <IoSearch />
                          </i>
                        </div>
                      </div>
                    </div>
                  </form>
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="#pablo">
                        <i className="now-ui-icons media-2_sound-wave">
                          <PiWaveformFill />
                        </i>
                        <p>
                          <span className="d-md-none d-md-block">Stats</span>
                        </p>
                      </a>
                    </li>

                    {/* <ul className="navbar-nav"> */}
                    <li className="nav-item-dropdown">
                      <a
                        className="nav-link"
                        id="navbarDropdownMenuLink"
                        href="#"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="now-ui-icons location_world">
                          <TiWorld />
                        </i>
                        <p>
                          <span className="d-lg-none d-md-block">Stats</span>
                        </p>
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="navbarDropdownMenuLink"
                      >
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </li>
                  </ul>
                  {/* <li className="nav-item dropdown">
                      <a
                        className="nav-link"
                        id="navbarDropdownMenuLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="now-ui-icons location_world dropdown-toggle">
                          <FaLocationCrosshairs />
                        </i>
                        <p>
                          <span className="d-lg-none d-md-block">Stats</span>
                        </p>
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="navbarDropdownMenuLink"
                      >
                        <a className="dropdown-item" href="/">
                          Action
                        </a>
                        <a className="dropdown-item" href="/">
                          Another action
                        </a>
                        <a className="dropdown-item" href="/">
                          Something else here
                        </a>
                      </div>
                    </li> */}
                  {/* </ul> */}
                </div>
              </div>{" "}
              {/* Closing container-fluid div */}
              <div className="form-container"></div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchbar;
