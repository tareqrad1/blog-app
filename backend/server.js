require('dotenv').config();
const express = require('express');
const ConnectToDB = require('./config/database');
const routerAuth = require('./router/auth.route');
const cors = require('cors');
const routerUser = require('./router/user.route');
const app = express();

//mongoose connection
ConnectToDB();
app.use(cors())

//start route server
app.use('/api/auth/', routerAuth);
app.use('/api/users', routerUser);

app.all('*', (req, res) => {
    return res.status(404).json({ status: 'error', message: 'this resource is not available' });
})

app.listen(process.env.PORT || 8000 , () => {
    console.log('starting server', process.env.PORT);
})