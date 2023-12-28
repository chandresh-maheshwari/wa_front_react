/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
// import React from 'react'
import React, { useState, useEffect } from 'react';
import './Service.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdDensityMedium } from 'react-icons/md';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import axios from 'axios';
// import parse from 'html-react-parser';

const Servicenave = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // const parse = require('html-react-parser').default;

    useEffect(() => {
        if (query.trim() !== '') {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://wafront.localhost.com/api/search/${query}`);
                    console.log(response.data);
           
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        } else {
            setSearchResults([]);
        }
    }, [query])
    
    return (
        <div className="hadik" style={{ marginLeft: "19%" }}>
            <nav className="navbar navbar-expand-lg navacolor navbar-absolute" style={{ width: "81%" }}>
                <div className="container-fluid">
                    <div className="navbar-wrapper">
                        <div className="navbar-toggle">
                            <button type="button" className="navbar-toggler">
                                <span className="navbar-toggler-bar bar1"></span>
                                <span className="navbar-toggler-bar bar2"></span>
                                <span className="navbar-toggler-bar bar3"></span>
                            </button>
                        </div>
                        <a className="navbar-brand" href="#pablo"></a>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navigation">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#pablo">
                                    <i className="now-ui-icons media-2_sound-wave"><MdDensityMedium /></i>
                                    <p>
                                        <span className="d-lg-none d-md-block">Stats</span>
                                    </p>
                                </a>
                            </li>
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="now-ui-icons location_world dropdown-toggle"><FaLocationCrosshairs /></i>
                                        <p>
                                            <span className="d-lg-none d-md-block">Stats</span>
                                        </p>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                        <a className="dropdown-item" href="/">Action</a>
                                        <a className="dropdown-item" href="/">Another action</a>
                                        <a className="dropdown-item" href="/">Something else here</a>
                                    </div>
                                </li>
                            </ul>
                        </ul>
                    </div>
                    <form>
                        <div className="input-group no-border">
                            <input type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <i className="now-ui-icons ui-1_zoom-bold"><AiOutlineSearch /></i>
                                </div>
                            </div>
                        </div>
                        <ul className='ulseachlist' >

                            {searchResults.map((hardik) => (
                                <div key={hardik.id}>
                                    <p style={{ whiteSpace: 'pre-line' }}>{hardik.id} {hardik.service_title} {hardik.description && hardik.description.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                                </div>
                            ))}
                        </ul>
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Servicenave
