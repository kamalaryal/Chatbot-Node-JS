const mongoose = require('mongoose');

const templatesSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    templatesType: { type: String },
    title: { type: String },
    subTitle: { type: String },
    imageURL:  { type: String },
    text: { type: String },
    postback: [
        {
            content_type: { type: String },
            type: { type: String },
            url: { type: String },
            title: { type: String },
            mediaType: { type: String },
            payload: { type: String }
        }
    ],
    status: { type: String }, //Pending, Draft, Sent
    createdDate: { type: Date, default: Date.now() } 
});

module.exports = mongoose.model('templates', templatesSchema);