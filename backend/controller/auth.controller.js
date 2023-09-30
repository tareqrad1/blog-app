const { registerSchema, loginSchema } = require('../util/validationSchema');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt')
const generateJWT = require('../middleware/generateJWT');

const register = async(req, res) => {
   try {
        const { error } = registerSchema.validate(req.body);
        if(error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { username, email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(user) {
            return res.status(200).json({ status: 'fail', message: 'User already registered'})
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const hashConfirmPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
        });
        await newUser.save();
        res.status(201).json({ status: 'success', message: 'User registered successfully' });
   }catch (error) {
        return res.status(501).json({ status:'error', error: error.message });
   }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' })
        }
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(404).json({ status: 'fail', message: 'Invalid email or password' });
        }
        const hashPassword = await bcrypt.compare(password, user.password);
        const accessToken = generateJWT({ id: user._id, username: user.username, isAdmin: user.isAdmin }); 
        if(user && hashPassword) return res.status(202).json({ status: 'success', data: { token: accessToken, user: user} });
        else if(!hashPassword) return res.status(404).json({ status: 'fail', message: 'Invalid email or password'})
        else return res.status(400).json({status: 'fail', message: 'Something Wrong !'})
    }catch (error) {
        return res.status(501).json({ status: 'error', message: error.message });
    }
}

const logout = async(req, res) => {

}

module.exports = {
    register,
    login,
    logout,
}