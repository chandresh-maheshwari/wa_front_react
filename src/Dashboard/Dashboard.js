import React, { useEffect, useState } from 'react';  // Import useState here
import axios from 'axios'; 
// import localStorage from 'local-storage'
// import '../App.css';
import Expired from '../Login/ExpiredToken'
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import ls from 'local-storage';

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

const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (token && userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      ls.set('Token', token);
      ls.set('user', user);

      // Redirect to actual dashboard after storing token
      navigate('/Dashboard', { replace: true });

    } else {
      // If no token in URL, redirect to login
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);


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
