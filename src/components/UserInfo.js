import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Box, Divider } from '@mui/material';
import { FaUser, FaEnvelope, FaLaravel } from 'react-icons/fa';

const UserInfo = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        console.log(userData);
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    if (!user) {
        return null;
    }

    return (
        <Box sx={{ 
            padding: '20px 15px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e9ecef',
            marginBottom: '20px'
        }}>
            <Box display="flex" alignItems="center" marginBottom="10px">
                <Avatar sx={{ 
                    bgcolor: user.source === 'Laravel' ? '#ff6b35' : '#1976d2',
                    marginRight: '10px'
                }}>
                    <FaUser />
                </Avatar>
                <Box>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                        <FaEnvelope style={{ marginRight: '5px', fontSize: '12px' }} />
                        {user.email}
                    </Typography>
                </Box>
            </Box>
            
            <Divider sx={{ marginY: '10px' }} />
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                    <FaLaravel style={{ marginRight: '5px', fontSize: '12px' }} />
                    Logged in via {user.source}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '2px 8px', 
                    borderRadius: '4px' 
                }}>
                    ID: {user.id}
                </Typography>
            </Box>
        </Box>
    );
};

export default UserInfo; 