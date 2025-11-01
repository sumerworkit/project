const { mongo } = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scits-portal-chts')
    .then(() => {console.log('Mongoose connected')})
    .catch(err => console.log(err));


const doubtSchema = new mongoose.Schema({
    faculty_name: String,
    subject : String,
    doubt : String,
    roll_number : String,
    clarification : String,
    clarified : Boolean,

    
}) ;

const DoubtModel = mongoose.model('DoubtModel',doubtSchema);

module.exports = DoubtModel;