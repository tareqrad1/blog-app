const jwt = require('jsonwebtoken');

const verifyToken = async(req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) return res.status(401).json({ message: 'Invalid authorization header' });
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // return username id email
        req.user = decodedToken;
        next();
    }catch (error) {
        return res.status(501).json({ error: error.message });
    }
}

//only admin can see the users profile
const verifyTokenAndAdmins = async(req, res, next) => {
    verifyToken(req,res, () => {
        if(req.user.isAdmin) {
            next();
        }else {
            return res.status(403).json({ status: 'fail', message: 'Not allowed you need to be admin !' });
        }
    })
}

const verifyTokenOnlyUser = async(req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id) {
            next();
        }else {
            return res.status(403).json({ status: 'fail', message: 'Not allowed Only Users himself !' });
        }
    })
}

//verify by admin and user 
const verifyTokenAuthorization = async(req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else {
            return res.status(403).json({ status: 'fail', message: 'Not allowed Only Users himself !' });
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmins,
    verifyTokenOnlyUser,
    verifyTokenAuthorization,
}
