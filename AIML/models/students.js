const { mongo } = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scits-portal-chts')
    .then(() => {console.log('Mongoose connected')})
    .catch(err => console.log(err));


const studentSchema = new mongoose.Schema({
    student_name : String,
    roll_number : String,
    branch : String,
    section : String,
    year : String,
    total_classes : Number,
    attended_classes : Number,
    subjects : [String],
    
}) ;

const StudentModel = mongoose.model('StudentModel',studentSchema);

module.exports = StudentModel;
