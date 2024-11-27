const mongoose = require('mongoose');
Schema = mongoose.Schema

const TagsSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, { timestamps: true })

const Tags = mongoose.model("tags", TagsSchema, 'tags');

module.exports = Tags;