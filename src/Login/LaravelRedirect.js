import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const LaravelRedirect = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLaravelRedirect = async () => {
            try {
                setIsLoading(true);
                
                // Get token from URL
                const token = searchParams.get('token');
                
                console.log('LaravelRedirect: Token found:', !!token); // Debug log
                
                if (token) {
                    // Decode the token
                    const userData = JSON.parse(atob(token));
                    
                    console.log('LaravelRedirect: User data decoded:', userData); // Debug log
                    
                    // Store user data
                    localStorage.setItem('user', JSON.stringify(userData));
                    localStorage.setItem('Token', token);
                    
                    // Store email and password for login form pre-filling
                    if (userData.email) {
                        localStorage.setItem('laravel_email', userData.email);
                        console.log('LaravelRedirect: Email stored:', userData.email); // Debug log
                    }
                    if (userData.password) {
                        localStorage.setItem('laravel_password', userData.password);
                        console.log('LaravelRedirect: Password stored'); // Debug log
                    }
                    
                    // Verify data is stored
                    const storedUser = localStorage.getItem('user');
                    const storedToken = localStorage.getItem('Token');
                    console.log('LaravelRedirect: Data stored in localStorage:', {
                        user: storedUser,
                        token: storedToken ? 'Token stored' : 'No token'
                    });
                    
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome!',
                        text: `Logged in as ${userData.name}`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    // Redirect to dashboard
                    navigate('/Dashboard');
                } else {
                    // No token, redirect to login
                    console.log('LaravelRedirect: No token found, redirecting to login');
                    navigate('/');
                }
                
            } catch (error) {
                console.error('LaravelRedirect: Error processing Laravel redirect:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to process login. Please try again.',
                });
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        handleLaravelRedirect();
    }, [navigate, searchParams]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
                <Typography variant="h6" style={{ marginLeft: 16 }}>
                    Logging you in...
                </Typography>
            </Box>
        );
    }

    return null;
};

export default LaravelRedirect; 