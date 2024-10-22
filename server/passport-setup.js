const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const UserModel = require('./Models/user');  // Adjust path as needed
const keys = require('./config/keys');  // Store your OAuth keys here

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new UserModel({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        googleId: profile.id
    });
    await newUser.save();
    done(null, newUser);
}));

// LinkedIn OAuth Strategy
passport.use(new LinkedInStrategy({
    clientID: keys.linkedinClientID,
    clientSecret: keys.linkedinClientSecret,
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new UserModel({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        linkedinId: profile.id
    });
    await newUser.save();
    done(null, newUser);
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: keys.githubClientID,
    clientSecret: keys.githubClientSecret,
    callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const existingUser = await UserModel.findOne({ email: profile.emails[0].value });
    if (existingUser) {
        return done(null, existingUser);
    }

    const newUser = new UserModel({
        firstName: profile.displayName,
        email: profile.emails[0].value,
        githubId: profile.id
    });
    await newUser.save();
    done(null, newUser);
}));
