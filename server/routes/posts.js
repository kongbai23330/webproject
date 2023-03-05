// Import necessary modules
const express = require('express');
const router = express.Router();
const { Post, Comment } = require('../models/Post');
const cors = require('cors');
// Enable CORS for this router
  router.use(cors());
router.get('/posts', async (req, res) => {
    
    try {
    
    const posts = await Post.find().populate('comments');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Authenticate user's token
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Get post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create new post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, author,token,vote } = req.body;
    const post = new Post({ title, content, author,token,vote });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create new comment for a post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { content, author,vote } = req.body;
    const comment = new Comment({ content, author,vote });
    await comment.save();
    const post = await Post.findById(req.params.id);
    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
    } 
    catch(err){}
});
router.post('/posts/:postId/upvote', async (req, res) => {
  try {
    const { postId } = req.params;
    const newVotes = req.body.vote;
    const token = req.body.token;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if the current user has already voted on this post
    if (post.voters.includes(postId)) {
      return res.status(400).json({ message: 'You have already voted on this post.' });
    }

    post.vote = newVotes;
    post.voters.push(token);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update post.' });
  }
});
// Upvote a comment
// Route to upvote a comment
router.post('/posts/:commentId/upvote/comment', async (req, res) => {
    try {
      const { commentId } = req.params;
      const newVotes = req.body.vote;
      const token = req.body.token;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(403).json({ message: 'Post not found.' });
      }
  
      // Check if the current user has already voted on this post
      if (comment.voters.includes(commentId)) {
        return res.status(400).json({ message: 'You have already voted on this post.' });
      }
  
      comment.vote = newVotes;
      comment.voters.push(token);
      const updatedPost = await comment.save();
      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update post.' });
    }
});
  // Delete a post by ID
router.delete('/posts/:postId',async (req, res) => {
    try {
        // Get post ID from request parameters
        const { postId } = req.params;
        const { token } = req.body;
        console.log(postId)
      const post = await Post.findByIdAndDelete(postId);
       // If the post is not found, return an error response
        if (!post) {
          // If there is an error, return an error response with the error message
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ message: 'Post deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  router.put('/posts/:postId', async (req, res) => {
      try {
        // Get post ID and updated post information from request body
      const { postId } = req.params;
      const { title, content, author } = req.body;
      const post = await Post.findByIdAndUpdate(postId, { title, content, author }, { new: true });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.put('/comments/:commentId', async (req, res) => {
      try {
        // Get comment ID and updated comment information from request body
      const { commentId } = req.params;
      const { content } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
          );
          // If the comment is not found, return an error response
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.json(updatedComment);
      } catch (err) {
           // If there is an error, return an error response with the error message
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
module.exports = router;