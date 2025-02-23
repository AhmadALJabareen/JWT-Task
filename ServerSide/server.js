import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';


const app = express();
const PORT = 6001;
const SECRET_KEY = 'ahmad123'; 



app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

app.use(express.json()); 
app.use(cookieParser());


let users = [];


function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, userData) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = userData; 
        next();
    });
}



app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        hashedPassword, 
    };
    users.push(newUser);


    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(201).json({ message: 'User created successfully', user: newUser });
});



app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '5h' });

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.json({ message: 'Logged in successfully', user: { id: user.id, name: user.name, email: user.email } });
});


app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
    });
});


app.post('/api/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ message: 'Logged out successfully' });
});


app.get('/api/users', (req, res) => {
    res.json(users);
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});