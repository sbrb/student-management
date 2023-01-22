const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { isValidObjectId } = require('../util/validator');

//authorization
const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) return res.status(400).send({ status: false, message: `Please provide token.` });
        token = req.headers.authorization.slice(7);

        jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
            if (err) return res.status(401).send({ status: false, message: `Authentication Failed!`, error: err.message });
            req['user'] = decoded.userId;
            next();
        })
    }
    catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

//authorization
const authorization = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).send({ status: false, message: `userId is required.` });
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: ` '${userId}' this userId invalid.` });

        const existUser = await userModel.findById(userId);
        if (!existUser) return res.status(404).send({ status: false, message: `User not found by '${userId}' this userId.` });

        if (req.user != userId)
            return res.status(403).send({ status: false, message: ` '${existUser.fname} ${existUser.lname}' you are unauthorized.` });
        next();
    }
    catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
};

module.exports = { authentication, authorization };