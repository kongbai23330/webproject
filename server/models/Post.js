const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    token: { type: String, required: true }, // add token field to schema
    vote: { type: Number, require: true },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    vote: { type: Number, require: true },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const Comment = mongoose.model('Comment', CommentSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports = {
    Post,
    Comment
  };