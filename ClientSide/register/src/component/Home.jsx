import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:6001/api/profile', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                setMessage('Failed to fetch profile');
                navigate('/login'); 
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:6001/api/users', { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                setMessage('Failed to fetch users');
            }
        };

        fetchProfile();
        fetchUsers();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:6001/api/logout', {}, { withCredentials: true });
            navigate('/login'); 
        } catch (error) {
            setMessage('Failed to logout');
        }
    };

    return (
        <div>
            <h1>Home Page</h1>

            <div>
                <h2>Profile</h2>
                {user ? (
                    <div>
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div>
                <h2>Users List</h2>
                {message && <p>{message}</p>}
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;