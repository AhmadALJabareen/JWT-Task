import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate ,Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:6001/api/login', { email, password }, { withCredentials: true });
            setMessage('Logged in successfully');
            navigate('/'); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <Link to={"/signup"}>dont have account ? create account</Link>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;