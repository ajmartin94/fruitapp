require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models').User;
const bcrypt = require('bcryptjs');

const renderLogIn = (req,res) => {
    res.render('users/logIn.ejs');
}

const logInHandler = (req,res) => {
    User.findOne({
        where: { 
            username: req.body.username
        }
    })
    .then(user => {
        bcrypt.compare(req.body.password,user.password, (err,match) => {
            if (match) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '30 days'
                    }
                );

                res.cookie('jwt',token);

                res.redirect(`/users/profile/${user.username}`);
            } else {
                res.render('users/login.ejs',{
                    msg: 'Password incorrect.',
                    user: req.body
                })
            }
        });
    })
    .catch(user => {
        res.render('users/login.ejs',{
            msg: 'Username not found.',
            user: req.body
        })
    })
}

const renderSignUp = (req,res) => {
    res.render('users/signup.ejs');
}

const addUser = (req,res) => {
    const pswdCheck = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}');

    if(!req.body.username || req.body.username === '') {
        res.render('users/signup.ejs',{
            msg: 'Username required',
            user: req.body
        })
    } else if(!req.body.password || req.body.password === '') {
        res.render('users/signup.ejs',{
            msg: 'Password required',
            user: req.body
        })
    } else if(!pswdCheck.test(req.body.password)) {
        res.render('users/signup.ejs',{
            msg: 'Password requirements not met. Please use at least 8 characters, a capital letter, lowercase letter, and a number.',
            user: req.body
        })
    } else {
        bcrypt.genSalt(10,(err,salt) => {
            if(err) {
                return res.send(err);
            } 
            bcrypt.hash(req.body.password,salt,(err,hashedPswd) => {
                if(err) {
                    return res.send(err);
                }
                req.body.password = hashedPswd;

                User.create(req.body)
                .then(newUser => {
                    const token = jwt.sign(
                        {
                            id: newUser.id,
                            username: newUser.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '30 days'
                        }
                    );

                    res.cookie('jwt',token);
                    res.redirect(`users/profile/${newUser.dataValues.username}`);
                })
                .catch(err => {
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        res.render('users/signup.ejs', {
                            msg: 'Username already exists.',
                            user: req.body
                        })
                    } else {
                        res.send("You've broken everything you dumbo")
                    }
                })
            });
        });
    }   
}

module.exports = { 
    renderLogIn,
    renderSignUp,
    addUser,
    logInHandler
}