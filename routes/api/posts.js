const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Post validation
const validatePostInput = require('../../validation/post');

// Load Post model
const Post = require('../../models/Post');

// Load Profile model
const Profile = require('../../models/Profile');

// @route GET /api/posts/test
// @desc Tests posts route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "Post works!!" }));

// @route GET /api/posts
// @desc Get posts
// @access Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: "No posts found." }));
});

// @route GET /api/posts/:id
// @desc Get posts by id
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }));
});

// @route POST /api/posts
// @desc Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Send 400 errors object if any errors
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });

    newPost.save().then(post => res.json(post));
});

// @route DELETE /api/posts/:id
// @desc Delete a post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: "User not authorized." })
                    }
                    // Delete post
                    post.remove().then(() => res.json({ success: true }))
                })
                .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }))
        })
});

// @route POST /api/posts/like/:id
// @desc Like a post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check if current user already liked the post
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: "You already liked this post." })
                    }

                    // Add user id to likes array
                    post.likes.unshift({ user: req.user.id })

                    // Save to db
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }))
        })
});

// @route POST /api/posts/unlike/:id
// @desc Unlike a post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check if current user already liked the post
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: "You have not liked this post yet." })
                    }

                    // Get index of user to be removed
                    const indexToRemove = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

                    // Splice the out of likes array
                    post.likes.splice(indexToRemove, 1);

                    // Save to db
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }))
        })
});

// @route POST /api/posts/comment/:id
// @desc Add comment to a post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        // Send 400 errors object if any errors
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            // Create new comment
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id,
            };

            // Add comment to comments array
            post.comments.unshift(newComment);

            // Save to db
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }))
});

// @route DELETE /api/posts/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            // Check if current user have any existing comment
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentdontexist: "No comment found." })
            };

            // Get index to remove
            const indexToRemove = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

            // Splice the found comment from the array
            post.comments.splice(indexToRemove, 1);

            // Save to db
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ nopostfound: "No post found with that ID." }));
});


module.exports = router;