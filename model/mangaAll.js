var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    name: [{
        type: String,
        required: true
    }],
    source: { type: String, required: true },
    author: { type: String },
    authorlink: { type: String },
    anime_id: { type: Number, required: true, unique: true },
    star: { type: String }

}, { collection: 'manga_all' });
module.exports = mongoose.model("manga_all", userSchema);