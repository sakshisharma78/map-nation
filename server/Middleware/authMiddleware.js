const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Adjust the path to your User model

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, "sakshisharma123");

            // Fetch user from the database and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error('Error during token verification:', error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = protect;
