const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required : true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: Object,
        default : {
            url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            publicId: null,
        }
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAccountVerify: {
        type: Boolean,
        default: false,
    }
}, { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });

userSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'user',
    localField: '_id',
})

module.exports = mongoose.model('User', userSchema);