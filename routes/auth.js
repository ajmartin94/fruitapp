const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.get('/logIn',ctrl.auth.renderLogIn);
router.get('/signUp',ctrl.auth.renderSignUp);

router.post('/',ctrl.auth.addUser);
router.post('/logIn', ctrl.auth.logInHandler);

module.exports = router;