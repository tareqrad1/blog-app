const Post = require('../models/postSchema');
const path = require('path');
const fs = require('fs');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../util/cloudinary");

const createPost = async (req, res) => {
    if(!req.file) return res.status(404).json({ status:'fail', message: 'Invalid post file' });

    const pathImage = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(pathImage);
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id, // thats take id from header Bearer when i add post 
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }
    })
    await newPost.save();

    res.status(201).json({ status:'success', post: newPost });
    fs.unlinkSync(pathImage);
}

//filtration and sorting and pagination methods
const getAllPost = async (req, res) => {
    const POST_PAGE = 3;
    const { pageNumber, category } = req.query;
    let posts;
    
    if(pageNumber) {
        posts = await Post.find().skip((pageNumber - 1) * POST_PAGE).limit(POST_PAGE)
        .sort({ createdAt: -1 })
        .populate('user', ['-password', '-confirmPassword']);
    }else if(category) {
        posts = await Post.find({ category })
        .sort({ createdAt: -1 })
        .populate('user', ['-password', '-confirmPassword']);
    }else {
        posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('user', ['-password', '-confirmPassword']);
    }
    res.status(200).json({ status: 'success', posts: posts });
}

const deletePost = async(req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });
    if(req.user.isAdmin || req.user.id === post.user.toString()) { // req.user.id >> thats mean adding the header Bearer
        await Post.findByIdAndDelete(req.params.id);
        await cloudinaryRemoveImage(post.image?.publicId);
        res.status(200).json({ status: 'success', message: 'Post successfully deleted' });
    }else {
        res.status(402).json({ status: 'success', message: 'sorry you need to be admin or himself post' });
    }
}

const updatePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });
        if(req.user.id === post.user.toString()) {
            await Post.findByIdAndUpdate(req.params.id, {$set: {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
            }}, { new: true })
            res.status(200).json({ status: 'success', message: 'updated successfully'});
        }else {
            return res.status(404).json({ status: 'fail', message: 'post only edit by user himself' });
        }
    } catch (error) {
        res.status(501).json({ status: 'error', error: error.message });
    }
}


const updatePostImage = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ status: 'fail', message: 'Post not found' });
        if(req.user.id === post.user.toString()) {
            await cloudinaryRemoveImage(post.image.publicId);
            const pathImage = path.join(__dirname, `../images/${req.file.filename}`);
            const result = await cloudinaryUploadImage(pathImage);
            await Post.findByIdAndUpdate(req.params.id, {$set: {
                image: {
                    url: result.secure_url,
                    publicId: result.public_id,
                }
            }}, { new: true })
            res.status(200).json({ status: 'success', message: 'updated image successfully'});
            fs.unlinkSync(pathImage)
        }else {
            return res.status(404).json({ status: 'fail', message: 'image only edit by user himself' });
        }
    }catch (error) {
        res.status(501).json({ status: 'error', error: error.message });
    }
}

//likes 
const toggleLike = async(req, res) => {
    let post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ message: "post not found" });
    }

    const isLiked = post.like.find((user) => user.toString() === req.user.id)
    if(isLiked) {
        post = await Post.findByIdAndUpdate(req.params.id, { // deleting likes
            $pull: { like: req.user.id }
        }, {new: true})
    }else {
        post = await Post.findByIdAndUpdate(req.params.id, { // adding likes
            $push: { like: req.user.id }
        }, {new: true})
    };
    res.status(200).json(post);
}

module.exports = {
    createPost,
    getAllPost,
    deletePost,
    updatePost,
    toggleLike,
    updatePostImage,
}