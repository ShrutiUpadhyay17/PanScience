
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        
        user = new User({ email, password });
        await user.save();

        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const user = await User.findOne({ email }).select('+password');
        
       
        if (!user || !(await bcrypt.compare(password, user.password))) {
             return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};