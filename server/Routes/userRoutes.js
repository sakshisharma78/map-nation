const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserModel = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const protect = require('../Middleware/authMiddleware');
const session = require('express-session');
require('../passport-setup'); // Import passport configuration

// Setup session
router.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use an environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set cookie secure option in production
}));

// Initialize passport
router.use(passport.initialize());
router.use(passport.session());

// Register User
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, contact, email, password, confirmPassword } = req.body;

        // Check for existing user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                error: true,
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                error: true,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Use a fixed salt rounds for consistency

        // Create and save the user
        const user = new UserModel({
            firstName,
            lastName,
            contact,
            email,
            password: hashedPassword
        });

        const userSave = await user.save();

        return res.status(201).json({
            message: "User created successfully",
            data: userSave,
            success: true
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({
            message: error.message || "An error occurred during registration",
            error: true
        });
    }
});




router.post("/login", async (req, res) => {
    try {
     const { email, password } = req.body;
    
     // Find the user by email
     const existingUser = await UserModel.findOne({ email });
     console.log(existingUser); // Log user details for debugging
    
     if (!existingUser) {
     return res.status(404).send({ authentication: false, message: "User not found." });
     }
    
     // Compare the provided password with the hashed password
     const isMatch = await bcrypt.compare(password, existingUser.password);
     console.log(`Password Match: ${isMatch}`); // Log the result of the comparison
     
     if (!isMatch) {
     return res.status(401).send({ authentication: false, message: "Invalid credentials." });
     }
    
     // If passwords match, create a JWT token
     const data = {
     user: {
     id: existingUser._id, // Use _id instead of id for MongoDB
     },
     };
    
     const authToken = jwt.sign(data, 'sakshisharma123', { expiresIn: '1d' });
    
     return res.send({ authentication: true, token: authToken });
    } catch (err) {
     console.error('Login Error:', err);
     return res.status(500).json({ error: "Some error occurred", details: err.message });
    }
    });
    






// OAuth routes (Google, LinkedIn, GitHub)
const createOAuthCallback = (provider) => {
    return (req, res) => {
        const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET || 'defaultJwtSecret', { expiresIn: '1d' });
        res.redirect(`/dashboard?token=${token}`); // Redirect to your dashboard with JWT token
    };
};

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), createOAuthCallback('google'));

router.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['r_liteprofile', 'r_emailaddress'] }));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login', session: false }), createOAuthCallback('linkedin'));

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), createOAuthCallback('github'));

// Dashboard route using the protect middleware
router.get('/dashboard', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await UserModel.findById(userId).select('-password'); // Exclude password from response
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userDetails);
    } catch (err) {
        res.status(500).json({ message: 'Some error occurred', error: err.message });
    }
});

module.exports = router;
