const mongoose = require('mongoose');
Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: null },
    photo: { type: String, default: null },   
    tags: [{ type: String, default: null }],   
}, { timestamps: true })

const Posts = mongoose.model("posts", PostSchema, 'posts');

module.exports = Posts;