const express = require('express');
const { getUser, createUser, updateUser, deleteUser, getUserTestimonials } = require('../controllers/userController');

const router = express.Router();

router.get('/user', getUser);

router.post('/user', createUser);

router.put('/user', updateUser);

router.delete('/user', deleteUser);

router.get('/user-testimonials', getUserTestimonials);

module.exports = router;
