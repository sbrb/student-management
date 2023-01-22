const express = require('express');
const router = express.Router();
const { createUser, login } = require('../controllers/userController');
const { addStudent, getStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { authentication, authorization } = require('../middleware/auth');

//user
router.post('/user/register', createUser);
router.post('/user/login', login);

//student
router.post('/student/user/:userId', authentication, authorization, addStudent);
router.get('/student/user/:userId', authentication, getStudent);
router.put('/student/:studentId/user/:userId', authentication, authorization, updateStudent);
router.delete('/student/:studentId/user/:userId', authentication, authorization, deleteStudent);

module.exports = router;