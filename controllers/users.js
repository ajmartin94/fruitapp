const User = require('../models').User;
const Fruit = require('../models').Fruit;

const renderProfile = (req,res) => {
    User.findOne({ 
        where: { username: req.user.username},
        include: [{
            model: Fruit,
            attributes: ['id','name']
        }]
    })
    .then(user => {
        res.render('users/profile.ejs', {
            user:user
        });
    })
}

const editProfile = (req,res) => {
    User.update(req.body, {
        where: {username: req.user.username},
        returning: true
    })
    .then(user => {
        res.redirect(`/users/profile`);
    })
}

const deleteProfile = (req,res) => {
    User.destroy({
        where: {username: req.params.username}
    })
    .then(() => {
        res.redirect('/');
    })
}

module.exports = { 
    renderProfile,
    editProfile,
    deleteProfile
}