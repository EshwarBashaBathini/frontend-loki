import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if both email and role are present
        const isLoggedIn = localStorage.getItem('email') && localStorage.getItem('role');
        if (!isLoggedIn) {
             // Reload the entire application

            // If user is not logged in, redirect to login page
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Dashboard</h1>
            {/* Dashboard content goes here */}
        </div>
    );
};

export default Dashboard;
