const express = require('express');
const { createComment, getAllComments, deleteComment, updateComment } = require('../controller/comment.controller');
const { verifyToken, verifyTokenAndAdmins } = require('../middleware/verifyToken');
const router = express.Router();
router.use(express.json());


router.route('/')
                .get(verifyTokenAndAdmins, getAllComments)
                .post(verifyToken, createComment)


router.route('/:id')
                    .delete(verifyToken, deleteComment)
                    .patch(verifyToken, updateComment)


module.exports = router;