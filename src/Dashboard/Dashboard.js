import React, { useEffect, useState, useRef } from 'react';  // Import useState here
import axios from 'axios'; 
// import localStorage from 'local-storage'
// import '../App.css';
import Expired from '../Login/ExpiredToken'
// import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import ls from 'local-storage';
import Authapi from "../Authapi";
function Dashboard() {
//  const [authData, setAuthData] = useState(null);

//   useEffect(() => {
//     async function fetchAuthData() {
//       try {
//         // ✅ Get token from cookie
//         const token = Cookies.get('cms_token');

//         if (!token) {
//           console.warn('No token found in cookies');
//           return;
//         }

//         const response = await axios.get('http://walara.localhost.com/api/cms-auth-data', {
//           headers: {
//             Authorization: `Bearer ${token}`, // ✅ JWT sent correctly
//           },
//           withCredentials: true, // ⬅️ Needed if server sets cookies
//         });

//         setAuthData(response.data);
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       } catch (err) {
//         console.error('Error fetching auth data:', err);
//       }
//     }

//     fetchAuthData();
//   }, []);

//   if (!authData) {
//     return <div>Loading...</div>;
//   }



 const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // ✅ Step 1: Handle token in URL once (on first login)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log(token);
    const userParam = params.get('user');

    if (token && userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('Token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/Dashboard', { replace: true }); // ✅ clean URL
    }
  }, [location.search, navigate]);

  // ✅ Step 2: Only call API if token exists
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const token = localStorage.getItem('Token');
  //     if (!token) {
  //       navigate('/'); // redirect to login
  //       return;
  //     }

  //     try {
  //       const response = await Authapi.getUserData(); // your API call
  //       console.log("User Info:", response);
  //       // you can store in state if needed
  //     } catch (error) {
  //       console.error("API Error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [navigate]);

  // return <div>Loading...</div>;


    return (
        <>
            <Expired />
            {/* change on 7 jan a Comment this code  */}
            {/* <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='maincard'>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "" }}>
                            <h5 className="text-cnter">Welcome to WasteAccountant Dashboard</h5>
                        </div>
                    </div>
                </div>
            </div> */}


        </ >
    )
}

export default Dashboard
