require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express(); // -> turns into an object with this syntax. Express itself is just the libray that we're putting into the app.

// using middleware, we convert request body into a url encoded object
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(cookieParser());

const verifyToken = (req, res, next) => {
    let token = req.cookies.jwt;
    console.log(`Token: ${token}`);

    jwt.verify(token,process.env.JWT_SECRET,(err, decodedUser) => {
        if(err || !decodedUser) {
            return res.send('Something bad happened')
        }
        console.log(decodedUser);
        req.user = decodedUser;
        next();
    })
}

const routes = require('./routes');

app.use('/fruits',verifyToken, routes.fruits);
app.use('/users', verifyToken, routes.users);
app.use('/auth', routes.auth);

app.get('/', (req,res) => {
    res.render('users/homepage.ejs')
})

// the application uses the server to function (memory, processing, etc). My comp local server is called 'local host'. Fruit app will run on the local host on port 3000.
// listen is used to run the app on port 3000 in this case, but the syntax is all nodeJS.
app.listen(process.env.PORT /* this is the port number*/, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})