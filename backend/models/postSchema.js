const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    user: { // take id from logged in user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        default: {
            url: '',
            publicId: null,
        }
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'postId',
    localField: '_id',
})

module.exports = mongoose.model('Post', postSchema);