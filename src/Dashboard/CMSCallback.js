// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Swal from 'sweetalert2';

// function CMSCallback() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const token = queryParams.get('token');
//         const user = queryParams.get('user');
//         console.log(token);
//         console.log(user);

//         if (token && user) {
//             try {
//                 const parsedUser = JSON.parse(user);

//                 // Save to localStorage
//                 localStorage.setItem('Token', token);
//                 localStorage.setItem('user', JSON.stringify({
//                     ...parsedUser,
//                     source: 'Laravel CMS Redirect'
//                 }));

//                 // Optional: Clear query params from URL
//                 navigate('/Dashboard', { replace: true });

//             } catch (error) {
//                 console.error('Failed to parse user from query string', error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Invalid User Data',
//                     text: 'Could not log you in.',
//                 });
//             }
//         } else {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Missing credentials',
//                 text: 'No token or user data found in URL.',
//             });
//             navigate('/');
//         }
//     }, [location, navigate]);

//     return <div>Logging you in...</div>;
// }

// export default CMSCallback;

// import { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function CMSCallback() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchToken() {
//       try {
//         const res = await axios.get('http://walara.localhost.com/api/generate-token', {
//           withCredentials: true,
//         });

//         const { token, user } = res.data;

//         // Store token in localStorage or cookie
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));

//         // Set the token globally (optional)
//         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//         // Redirect to the actual dashboard
//         // navigate('/cms/Dashboard');
//         window.location.href = 'http://localhost:3000/cms/Dashboard';

//       } catch (err) {
//         console.error('Auth failed', err);
//         navigate('/login');
//       }
//     }

//     fetchToken();
//   }, []);

//   return <div>Authorizing CMS access...</div>;
// }

// export default CMSCallback;
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ls from 'local-storage';

const CMSCallback = () => {
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

  return <div>Loading...</div>;
};

export default CMSCallback;

