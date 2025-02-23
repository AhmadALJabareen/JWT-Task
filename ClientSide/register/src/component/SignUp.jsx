import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:6001/api/signup', { name, email, password }, { withCredentials: true });
            setMessage('User created successfully');
            navigate('/'); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div>
            <h1>Sign Up Page</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
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
            <button onClick={handleSignup}>Sign Up</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignUp;