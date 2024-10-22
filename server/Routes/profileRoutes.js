// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const multer = require('multer');
const path = require('path');

// Multer setup for handling image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Fetch user profile
router.get('/user', async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming you have middleware to set req.user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile
router.put('/', upload.single('profileImage'), async (req, res) => {
    try {
        const { firstName, lastName, bio, contact, email, github, linkedin, website } = req.body;
        const profileImage = req.file ? req.file.path : null;

        // Find the user by ID
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.bio = bio || user.bio;
        user.contact = contact || user.contact;
        user.email = email || user.email;
        user.github = github || user.github;
        user.linkedin = linkedin || user.linkedin;
        user.website = website || user.website;

        // Update profile image if a new one is uploaded
        if (profileImage) {
            user.profileImage = profileImage;
        }

        // Save the updated user
        await user.save();

        // Send the updated user object as response
        res.json(user);
    } catch (err) {
        // Handle unexpected errors
        console.error(err);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});


module.exports = router;
