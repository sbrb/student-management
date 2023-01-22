const mongoose = require('mongoose');

const isValidBody = (d) => Object.keys(d).length > 0;
const isValidName = (n) => /^[a-zA-Z.]+$/i.test(n);
const isValidStudentName = (nm) => /^[a-z A-Z,.'-]+$/i.test(nm);
const isValidMobile = (m) => /^[6-9]\d{9}$/.test(m);
const isValidEmail = (e) => /^([a-zA-Z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/.test(e);
const isValidPass = (p) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(p);
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const isValidSubject = (s) => ['CSE', 'Math', 'English', 'Bengali', 'History', 'Geography'].includes(s);
const isValidNumber = (num) => /^[0-9]+$/.test(num); 

module.exports = { isValidBody, isValidName, isValidStudentName, isValidMobile, isValidEmail, isValidPass, isValidObjectId, isValidSubject, isValidNumber };
