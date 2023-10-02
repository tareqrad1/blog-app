const User = require('../models/userSchema');
const Comment = require('../models/commentSchema');

const createComment = async(req, res) => {
    try {
        const profile = await User.findById(req.user.id);
        const comment = new Comment({
            postId: req.body.postId,
            user: req.user.id,
            text: req.body.text,
            username: profile.username,
        })
        await comment.save();
        res.status(201).json({ status: 'success', comment: comment });
    }catch (error) {
        res.status(501).json({ status: 'fail', message: error.message });
    }
}

// only admin
const getAllComments = async(req, res) => {
    const comments = await Comment.find().exec();
    if(!comments.length) {
        res.status(404).json({ status: 'fail', message: 'No comments found' });
    }
    res.status(200).json({ status: 'success', comments: comments });
}

// only user himself and admin
const deleteComment = async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if(req.user.isAdmin || req.user.id === comment.user.toString()) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: 'success', message: 'Comment deleted successfully' });
        }else {
            res.status(403).json({ status: 'fail', message: 'Thats Not Your Comments !'});
        }
    } catch (error) {
        return res.status(501).json({ status: 'error', message: error.message });
    }
}

const updateComment = async(req, res) => {
    const comment = await Comment.findById(req.params.id);
    if(!comment) return res.status(404).json({ status: 'fail', message: 'Comment not found' });
    try {
        if(req.user.id === comment.user.toString()) {
            const news = await Comment.findByIdAndUpdate(req.params.id, { 
                $set: { text: req.body.text }
            }, { new: true });
            res.status(200).json({ status: 'success', message: 'updated successfully', news });
        }else {
            res.status(200).json({ status: 'success', message: 'not your comment !' });
        }
    } catch (error) {
        res.status(501).json({ status: 'error', message: error.message });
    }
}
module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    updateComment
}