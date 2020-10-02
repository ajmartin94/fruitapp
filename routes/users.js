const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

router.get('/profile',ctrl.users.renderProfile);

router.put('/profile/:username',ctrl.users.editProfile);
router.delete('/profile/:username',ctrl.users.deleteProfile);

module.exports = router;