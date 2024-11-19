const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();
const salt = bcrypt.genSaltSync(10);
const secret = '732t8qgwqudhqwd8hhd9';

// Set up multer with extended limits for field size and file size
const uploadMiddleware = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // Set a limit of 5 MB for file uploads
    fieldSize: 1 * 1024 * 1024, // Set a limit of 1 MB for each non-file field
  },
});


// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(500).json({ error: 'Signup failed', details: e.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json({ error: 'User not found' });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (error, token) => {
      if (error) return res.status(500).json({ error: 'Token generation failed' });
      res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json({ error: 'Wrong credentials' });
  }
});

// Profile Route
router.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json(info);
  });
});

// Logout Route
router.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, secure: false, sameSite: 'lax' }).json({ message: 'Logged out' });
});

//create post route
router.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });

      const { title, summary, content } = req.body;

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      // Handle Multer-specific errors here
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Max size is 5 MB.' });
      } else if (error.code === 'LIMIT_FIELD_VALUE') {
        return res.status(400).json({ error: 'Field value is too large.' });
      }
      return res.status(400).json({ error: 'File upload error', details: error.message });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
// router.post('/post', uploadMiddleware.single('file'), async (req, res) => {
//   try {
//     const { originalname, path } = req.file;
//     const ext = originalname.split('.').pop();
//     const newPath = `${path}.${ext}`;
//     fs.renameSync(path, newPath);

//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//       if (err) return res.status(403).json({ error: 'Invalid token' });
//       const { title, summary, content } = req.body;

//       const postDoc = await Post.create({
//         title,
//         summary,
//         content,
//         cover: newPath,
//         author: info.id,
//       });
//       res.json(postDoc);
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create post', details: error.message });
//   }
// });

// Update Post Route
router.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    const { id, title, summary, content } = req.body;

    const postDoc = await Post.findById(id);
    if (!postDoc) return res.status(404).json({ error: 'Post not found' });

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) return res.status(400).json({ error: 'You are not the author' });

    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath || postDoc.cover,
    });
    res.json(postDoc);
  });
});

// Get Posts Route
router.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch posts', details: e.message });
  }
});

// Get a specific post by ID
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', ['username']);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch post', details: e.message });
  }
});
// Delete Post Route
router.delete('/post/:id', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(403).json({ error: 'You must be logged in to delete a post' });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    try {
      const postDoc = await Post.findById(req.params.id);

      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the current user is the author of the post
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json({ error: 'You are not the author of this post' });
      }

      // If the user is the author, delete the post
      await Post.findByIdAndDelete(req.params.id);

      res.json({ message: 'Post deleted successfully' });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete post', details: e.message });
    }
  });
});


module.exports = router;
