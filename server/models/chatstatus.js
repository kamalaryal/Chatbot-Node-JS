const mongoose = require('mongoose');

const ChatStatusSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    user_id: { type: String, unique: true },
    name: {
        first: { type: String },
        last: { type: String }
    },
    profile_pic: { type: String },
    locale: { type: String },
    gender: { type: String } ,
    status: { type: String } //pending, deleted
});

module.exports = mongoose.model('ChatStatus', ChatStatusSchema);