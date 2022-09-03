const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // public routes: 
    async createUser(req, res) {
        // check if email already registered:
        const emailExistsInDB = await User.findOne({ email: req.body.email });
        if (emailExistsInDB) return res.status(400).send('Email already registered!');

        // register new user with bcrypt-hashed password:
        const salty = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salty);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            packets: []
        });
        
        try {
            await user.save();
            res.status(200).send('User created!');
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async authenticateUser(req, res) {
        try {
            // check if email registered:
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(400).send('Email or password wrong!');

            // check password:
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).send('Email or password wrong!');

            // change user's loggedIn field in MongoDB to true
            await User.findOneAndUpdate({ _id: user._id }, { loggedIn: true });

            // create JWT and send it:
            const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET);
            res.header('auth-token', token);

            res.status(200).send('logged in and got token');
            
            // 🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀
            //
            // MAKE SURE TO CATCH the auth-token HEADER AND SAVE IN LOCAL STORAGE
            //
            // 🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀🎉🎀

        } catch (error) {
            res.status(400).send('MongoDB error - Unable to find user even though password is correct: ', error);
        }        
    },

    // protected routes:
    async logoutUser(req, res) {
        try {
            // update DB that user's loggedIn field is false:
            await User.findOneAndUpdate({ _id: req.userInfo._id }, { loggedIn: false });
            // clear JWT token:
            //res.header('auth-token', "");
            res.removeHeader('auth-token');
            
            res.status(200).send('Successfully logged out');
        } catch (error) {
            res.status(400).send('Error logging out: ', error);
        }
    },
    async changePassword(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });

            // check password:
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).send('Wrong password!');

            const salty = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salty);

            // perform logout and change password
            user.password = hashedPassword;
            await user.save();

            // clear JWT token:
            res.removeHeader('auth-token');

            res.status(200).send('Successfully changed password! Please log in again.');
        } catch (error) {
            res.status(400).send('Error changing password: ', error);
        }
    }
}