const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load register validation
const validateRegisterInput = require('../../validation/register')

// Load rogin validation
const validateLoginInput = require('../../validation/login')

// Load keys
const keys = require('../../config/keys')

// Load User model
const User = require('../../models/User');

// @route GET /api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "Users works!!" }));

// @route GET /api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Validation check
    if (!isValid) {
        return res.status(400).json(errors)
    }

    // Check if email already exists
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists!" })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            })
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hashedpw) => {
                    if (err) { throw err };
                    newUser.password = hashedpw;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
});

// @route GET /api/users/login
// @desc Login user / Returning JWT token
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Validation check
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user buy email
    User.findOne({ email })
        .then(user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors)
            }
            // Check password if matched
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched

                        // Create JWT payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                        }

                        // Sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });
                    } else {
                        errors.password = 'Password incorrect.'
                        return res.status(400).json(errors)
                    }
                });
        });
});

// @route GET /api/users/current 
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
});

module.exports = router;