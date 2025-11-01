
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scits-portal-chts')
    .then(() => {console.log('Mongoose connected')})
    .catch(err => console.log(err));



const hodSchema = new mongoose.Schema({ 
    user_name: String,
    password: String
}); 

const HodModel = mongoose.model('HodModel', hodSchema);

// Insert data


const data = async () => {
    const csm = new HodModel({ user_name: 'CSM@SCITS', password: 'CSM_CHTS@SCITS' });
    const cse = new HodModel({ user_name: 'CSE@SCITS', password: 'CSE_CHTS@SCITS' });
    const ece = new HodModel({ user_name: 'ECE@SCITS', password: 'ECE_CHTS@SCITS' });
    const eee = new HodModel({ user_name: 'EEE@SCITS', password: 'EEE_CHTS@SCITS' });

    const check = await HodModel.findOne({user_name : 'CSM@SCITS', password: 'CSM_CHTS@SCITS'});

    if(!check) {

  await  HodModel.insertMany([csm, cse, ece, eee]).then(()=> console.log("HOD data inserted")).catch(err=>console.log(err));
    

    }
}


    module.exports = HodModel;