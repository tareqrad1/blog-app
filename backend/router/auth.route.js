const express = require('express');
const { register, login } = require('../controller/auth.controller');
const { getAllUsers } = require('../controller/users.controller');
const router = express.Router();
router.use(express.json());

router.route('/')
            .get(getAllUsers)

router.route('/register')
                .post(register)


router.route('/login')
                .post(login)



module.exports = router;