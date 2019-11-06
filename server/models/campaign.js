const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    templatesId: { type: mongoose.Schema.Types.ObjectId, ref: 'templates' },
    campaignSequence: { type: Number, unique: true},
    status: { type: String }, //pending, deleted
    createdDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('campaign', campaignSchema);