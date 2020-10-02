const Fruit = require('../models').Fruit;
const User = require('../models').User;
const Season = require('../models').Season;

const index = (req,res) => {
    Fruit.findAll() //select * from "Fruits"
    .then(fruits => {
        res.render('index.ejs', {
            fruits: fruits
        });
    });
};

const show  = (req,res) => {
    Fruit.findByPk(req.params.index, {
        include: [User,Season]
    }) 
    .then(fruit => {
        res.render('show.ejs',{
            fruit:fruit
        })
    })
}

const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true; //do some data correction
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false; //do some data correction
    }

    Fruit.create(req.body)
    .then(newFruit => {
        res.redirect('/fruits')
    })
}

const removeFruit = (req,res) => {
    Fruit.destroy({
        where: {id: req.params.index}
    })
    .then(() => {
        res.redirect('/fruits');
    })
}

const renderEdit = (req,res) => {
    Fruit.findByPk(req.params.index)
    .then(foundFruit => {
        Season.findAll()
        .then(seasons => {
            res.render('edit.ejs', {
                fruit: foundFruit,
                seasons: seasons
            })
        })
    })
}

const editFruit = (req,res) => {
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    }
    else {
        req.body.readyToEat = false;
    }

    Fruit.update(req.body, {
        where: {id: req.params.index},
        returning: true
    })
    .then(updatedFruit => {
        Season.findByPk(req.body.season)
        .then(foundSeason => {
            Fruit.findByPk(req.params.index)
            .then(foundFruit => {
                foundFruit.addSeason(foundSeason); //.addSeason is a method dynamically created by sequelize
                res.redirect(`/fruits/${req.params.index}`);
            })
        })
    })
}

module.exports = {
    index,
    renderNew,
    postFruit,
    show,
    removeFruit,
    renderEdit,
    editFruit
}