const express = require('express');
const { createPost, getAllPost, deletePost, updatePost, updatePostImage, toggleLike } = require('../controller/post.controller');
const photoUpload = require('../middleware/photoUploads');
const { verifyToken, verifyTokenAuthorization } = require('../middleware/verifyToken');
const router = express.Router();
router.use(express.json());


router.route('/')
                .post(verifyToken, photoUpload.single('image'), createPost)
                .get(getAllPost)

router.route('/:id')
                    .delete(verifyToken, deletePost)
                    .patch(verifyToken, updatePost)

router.route('/upload-image/:id')
                                .patch(verifyToken, photoUpload.single('image'), updatePostImage)

router.route('/like/:id')
                        .patch(verifyToken, toggleLike)


module.exports = router;