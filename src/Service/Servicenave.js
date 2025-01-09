
import React, { useState, useEffect } from 'react';
import './Service.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdDensityMedium } from 'react-icons/md';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Authapi from '../Authapi';
import ls from 'local-storage';


const Servicenave = ({ setIsLoggedIn }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        if (query.trim() !== '') {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://wa_front.localhost.com/api/search/${query}`);
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


    const logoutData = async () => {
        try {

            const response = await Authapi.logoutData();
            console.log(response)
            ls.removeItem('Token');
            ls.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };




    return (
        <div className="hadik" style={{ marginLeft: "17%" }}>

            <nav className="navbar navbar-expand-lg navacolor navbar-absolute" style={{ width: "84%" }}>
                <div className="container-fluid">
                    <div className="navbar-wrapper">
                        <div className="navbar-toggle">
                            <button type="button" className="navbar-toggler">
                                <span className="navbar-toggler-bar bar1"></span>
                                <span className="navbar-toggler-bar bar2"></span>
                                <span className="navbar-toggler-bar bar3"></span>
                            </button>
                            <h5 className="text-cnter">Welcome to WasteAccountant Dashboard</h5> {/*change on 7 jan a add titlez*/}
                        </div>
                        <a className="navbar-brand" href="#pablo"></a>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                    </button>
                    <form>
                        <ul className='ulseachlist' >
                            {searchResults.map((hardik) => (
                                <div key={hardik.id}>
                                    <p style={{ whiteSpace: 'pre-line' }}>{hardik.id} {hardik.service_title} {hardik.description && hardik.description.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                                </div>
                            ))}

                        </ul>
                        {/* <Button className='btn btn-outline-light' onClick={logoutData}>Log Out</Button> */}
                        <button type="button" className="btn btn-outline-light" onClick={logoutData}>Logout</button>
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Servicenave
