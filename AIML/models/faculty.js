const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scits-portal-chts')
    .then(() => {console.log('Mongoose connected')})
    .catch(err => console.log(err));


const facultySchema = new mongoose.Schema({
    faculty_name : String,
    faculty_id : String,
    faculty_email : String,
    faculty_password : String,
    
    
});

const FacultyModel = mongoose.model('FacultyModel',facultySchema);

module.exports = FacultyModel;