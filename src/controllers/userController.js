const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isValidBody, isValidName, isValidMobile, isValidEmail, isValidPass } = require('../util/validator');

//createUser
const createUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { fname, lname, mobile, email, password } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if (!fname) return res.status(400).send({ status: false, message: 'fname is required.' });
        if (!lname) return res.status(400).send({ status: false, message: 'lname is required.' })
        if (!password) return res.status(400).send({ status: false, message: 'password is required.' });
        if (!mobile && !email) return res.status(400).send({ status: false, message: 'Please enter email or mobile number.' });

        if (!isValidName(fname)) return res.status(400).send({ status: false, message: 'Enter valid name first.' });
        if (!isValidName(lname)) return res.status(400).send({ status: false, message: 'Enter valid last name.' })
        if (!isValidPass(password)) return res.status(400).send({ status: false, message: 'Password should be 8-15 char & use 0-9,A-Z,a-z & special char this combination.' });
        if (email)
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'Enter a valid email.' });
        if (mobile)
            if (!isValidMobile(mobile)) return res.status(400).send({ status: false, message: 'Enter a valid mobile number.' });

        // existUser
        const existUser = await userModel.findOne({ $or: [{ email }, { mobile }] });
        if (existUser) return res.status(401).send({ status: false, message: 'Please login.' });

        //password hashing
        reqBody['password'] = await bcrypt.hash(password, 10);

        const saveData = await userModel.create(reqBody);
        return res.status(201).send({ status: true, data: saveData });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

//login
const login = async (req, res) => {
    try {
        const reqBody = req.body;
        const { mobile, email, password } = reqBody;

        if (!isValidBody(reqBody)) return res.status(400).send({ status: false, message: 'Please enter data.' })
        if (!isValidPass(password)) return res.status(400).send({ status: false, message: 'Password should be 8-15 char & use 0-9,A-Z,a-z & special char this combination.', });

        if (!email && !mobile) return res.status(400).send({ status: false, message: 'Please Enter user cridential.' })
        if (email)
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: `'${email}' email isn't valid.` })
        if (mobile)
            if (!isValidMobile(mobile)) return res.status(400).send({ status: false, message: `'${mobile}' mobile no isn't valid.` });

        //finding user
        const existUser = await userModel.findOne({ $or: [{ email }, { mobile }] });
        if (!existUser) return res.status(401).send({ status: false, message: 'Please register.' });

        //decoding hash password
        const matchPass = await bcrypt.compare(password, existUser.password);
        if (!matchPass) return res.status(401).send({ status: false, message: 'Wrong password.' });

        //token generation
        const payload = { userId: existUser._id, iat: Math.floor(Date.now() / 1000) };
        const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '365d' });

        return res.status(200).send({ status: true, message: 'Login Successful.', data: { userId: existUser._id, token: token } });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

module.exports = { createUser, login };
