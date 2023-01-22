const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const option = ['CSE', 'Math', 'English', 'Bengali', 'History', 'Geography'];

const studentSchema = new mongoose.Schema({
    studentName: { type: String, require: true, trim: true },
    subject: { type: String, enum: option, require: true, trim: true },
    marks: { type: Number, require: true, trim: true },
    userId: { type: ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('student', studentSchema);
