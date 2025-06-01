const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    videoUrl: { type: String, required: true },
    category: { type: String, enum: ['Comedy', 'Dance', 'Travel', 'Food', 'Fitness', 'Fashion'] },
    caption: { type: String, maxlength: 150 },       // Short text like a title or catchy phrase
   
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    shareCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reel', reelSchema);
