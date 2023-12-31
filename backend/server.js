require('dotenv').config();
const express = require('express');
const ConnectToDB = require('./config/database');
const routerAuth = require('./router/auth.route');
const cors = require('cors');
const routerUser = require('./router/user.route');
const routerPost = require('./router/post.route');
const routerComment = require('./router/comment.route');
const app = express();

//mongoose connection
ConnectToDB();

// cors 
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}))

//start route server
app.use('/api/auth', routerAuth);
app.use('/api/users', routerUser);
app.use('/api/posts', routerPost);
app.use('/api/comments', routerComment);

app.all('*', (req, res) => {
    return res.status(404).json({ status: 'error', message: 'this resource is not available' });
})

app.listen(process.env.PORT || 8000 , () => {
    console.log('starting server', process.env.PORT);
})