const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const { updateSchema } = require('../util/validationSchema');
const fs = require("fs");
const path = require("path");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../util/cloudinary");

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password').select('-confirmPassword');
        res.status(200).json({ status: 'success', data: { users: users } });
    }catch (error) {
        return res.status(501).json({ status: 'error', error: error.message });
    }
}

// populate('posts') >> adding field posts in userSchema and get in this field all post user created 
const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts').select('-password').select('-confirmPassword');
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ status: 'success', data: { user: user } });
    }catch (error) {
        return res.status(501).json({ status: 'error', error: error.message });
    }
}

/* only user himself can access this update request */
const updateUserProfile = async(req, res) => {
    const { error } = updateSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        if(req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, {$set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            bio: req.body.bio,
        }}, {new: true}).select('-password').select('-confirmPassword');
        if(!user) return res.status(404).json({ status:'fail', message: 'User not found' });
        return res.status(200).json({ status:'success', data: user })
    } catch (error) {
        return res.status(501).json({ status: 'error', error: error.message });
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        if(user.profilePicture?.publicId) {
            await cloudinaryRemoveImage(user.profilePicture.publicId);
        }
        res.status(200).json({ status: 'success', message: 'Profile successfully deleted' });
    } catch (error) {
        return res.status(501).json({ status: 'error', error: error.message });
    }
}

/* only admins can be see this */
const getUsersCount = async (req, res) => {
    const userCount = await User.count();
    res.status(200).json({ message: userCount });
}

/* Upload Images */
const updatePhotoUpload = async (req, res) => {
    if(!req.file) return res.status(404).json({ status:'fail', message: 'no file provided' });

    // 1- upload photo to cloudinary 
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    // 2- get user from db
    const user = await User.findById(req.user.id); // id come form header authorization
    if(user.profilePicture?.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePicture.publicId)
    }
    // 3- change image from db
    user.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
    }
    await user.save();
    // 4- send the response to client
    res.status(201).json({ message: 'Your profile photo updated', profilePicture: user.profilePicture })

    // 5- remove photo from images file << fs >>
    fs.unlinkSync(imagePath);
}

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    getUsersCount,
    updatePhotoUpload,
    deleteUserProfile,
}