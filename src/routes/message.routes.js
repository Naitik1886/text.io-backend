const express = require('express');
const protectedRoute = require('../middleware/auth.middleware.js');
const { usersForSideBar, getMessages, sendMessage , } = require('../controllers/message.controllers.js');

const router = express.Router();


router.get('/users' ,protectedRoute , usersForSideBar)

router.get('/:id',protectedRoute, getMessages)


router.post('/send/:id', protectedRoute,sendMessage)



module.exports = router;