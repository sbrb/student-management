const studentModel = require('../models/studentModel');
const { isValidBody, isValidStudentName, isValidObjectId, isValidSubject, isValidNumber } = require('../util/validator');

//addStudent
const addStudent = async (req, res) => {
    try {
        const reqBody = req.body;
        const { studentName, subject, marks, userId } = reqBody;
        
        if (!isValidBody(reqBody)) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if (!studentName) return res.status(400).json({ status: false, message: 'studentName is required.' });
        if (!subject) return res.status(400).json({ status: false, message: 'subject is required.' });
        if (!marks) return res.status(400).json({ status: false, message: 'marks is required.' });
        
        if (!isValidStudentName(studentName)) return res.status(400).json({ status: false, message: `'${studentName}' this studentName isn't valid.` });
        if (!isValidSubject(subject)) return res.status(400).json({ status: false, message: `subjects is only include ['CSE', 'Math', 'English', 'Bengali', 'History', 'Geography'].` });
        if (!isValidNumber(marks)) return res.status(400).json({ status: false, message: 'Please enter number only for marks.' });
        if (userId != req.user) return res.status(400).json({ status: false, message: 'userId is different on the body.' });

        //existsStudent
        let existsStudent = await studentModel.findOne({ studentName, subject, userId, isDeleted: false });
        if (existsStudent) {
            existsStudent.save(existsStudent.marks = existsStudent.marks + parseInt(marks));
            return res.status(201).json({ status: true, message: `'${studentName}' total mark is '${existsStudent.marks}'.`, data: existsStudent });
        }

        //saveData
        const saveData = await studentModel.create(reqBody);
        return res.status(201).json({ status: true, message: `'${studentName}' student added successfully.'`, data: saveData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

//getStudent
const getStudent = async (req, res) => {
    try {
        const { studentName, subject, marks } = req.query;
        const userId = req.params.userId;

        if (!userId) return res.status(400).json({ status: false, message: 'Please enter userId.' });
        if (studentName === "") return res.status(400).json({ status: false, message: 'please enter studentName.' });
        if (subject === "") return res.status(400).json({ status: false, message: 'Please enter subject.' });
        if (marks === "") return res.status(400).json({ status: false, message: 'Please enter marks.' });

        //studentData
        const studentData = await studentModel.findOne({ userId, isDeleted: false, ...req.query })
        return res.status(200).json({ status: true, message: 'success', data: studentData })
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
};

//updateStudent
const updateStudent = async (req, res) => {
    try {
        const userId = req.params.userId;
        const studentId = req.params.studentId;
        const reqBody = req.body;
        const { studentName, subject, marks } = reqBody;
        let obj = {};

        if (!isValidBody(reqBody)) return res.status(400).send({ status: false, message: 'Please enter data.' });
        if (!userId) return res.status(400).json({ status: false, message: 'userId is required in the params.' });
        if (!studentId) return res.status(400).json({ status: false, message: 'studentId is required in the params.' });
        if (!isValidObjectId(userId)) return res.status(400).json({ status: false, message: 'Please invalid userId.' });
        if (!isValidObjectId(studentId)) return res.status(400).json({ status: false, message: 'Please invalid studentId.' });

        //foundStudent
        const foundStudent = await studentModel.findOne({ userId, _id: studentId, isDeleted: false });
        if (!foundStudent) return res.status(404).json({ status: false, message: `'${userId}' this userId doesn't exist.` });

        if (studentName) {
            if (!isValidStudentName(studentName)) return res.status(400).json({ status: false, message: `'${studentName}' this studentName isn't valid.` });
            obj['studentName'] = studentName;
        };

        if (subject) {
            if (!isValidSubject(subject)) return res.status(400).json({ status: false, message: `subjects is only include ['CSE', 'Math', 'English', 'Bengali', 'History', 'Geography'].` });
            obj['subject'] = subject;
        };
        
        if (marks) {
            if (!isValidNumber(marks)) return res.status(400).json({ status: false, message: 'Please enter number only for marks.' });
            obj['marks'] = marks;
        };

        //updatedData
        const updatedData = await studentModel.findOneAndUpdate({ _id: foundStudent._id }, { $set: obj }, { new: true });
        return res.status(200).json({ status: true, message: `'${studentName}' student updated successfully.'`, updatedData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
};

//deleteStudent
const deleteStudent = async (req, res) => {
    try {
        const userId = req.params.userId;
        const studentId = req.params.studentId

        if (!userId) return res.status(400).json({ status: false, message: 'please provide a userId in params.' });
        if (!studentId) return res.status(400).json({ status: false, message: 'please provide a studentId in params.' });
        if (!isValidObjectId(userId)) return res.status(400).json({ status: false, message: 'Please invalid userId.' });
        if (!isValidObjectId(studentId)) return res.status(400).json({ status: false, message: 'Please invalid studentId.' });

        const foundUser = await studentModel.findOne({ userId });
        if (!foundUser) return res.status(404).json({ status: false, message: `'${userId}' this userId doesn't exists.` })
        if (foundUser.isDeleted === true) return res.status(404).json({ status: false, message: `'${foundUser.studentName}' student already deleted.` })

        //deleting
        await studentModel.findByIdAndUpdate({ _id: foundUser._id }, { $set: { isDeleted: true } }, { new: true });
        return res.status(200).json({ status: true, message: `'${foundUser.studentName}' student deleted successfully.` });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = { addStudent, getStudent, updateStudent, deleteStudent };
