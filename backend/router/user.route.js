const express = require('express');
const { getAllUsers, getUserProfile, updateUserProfile, getUsersCount, updatePhotoUpload, deleteUserProfile } = require('../controller/users.controller');
const { verifyTokenAndAdmins, verifyTokenOnlyUser, verifyToken, verifyTokenAuthorization } = require('../middleware/verifyToken');
const photoUpload = require('../middleware/photoUploads');
const router = express.Router();
router.use(express.json());

router.route('/profile')
                    .get(verifyTokenAndAdmins, getAllUsers)
                    
router.route('/profile/:id')
                    .get(getUserProfile)
                    .patch(verifyTokenOnlyUser, updateUserProfile)
                    .delete(verifyTokenAuthorization , deleteUserProfile)
                    
router.route('/profile/profile-photo')
                    .post(verifyToken, photoUpload.single("image"), updatePhotoUpload)
                    
router.route('/count')
                    .get(verifyTokenAndAdmins, getUsersCount)


module.exports = router;