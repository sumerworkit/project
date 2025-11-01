const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');



const port = 3000;

//models  
const HodModel = require('../models/hod-login');
const FacultyModel = require('../models/faculty');
const { redirect } = require('react-router-dom');
const StudentModel = require('../models/students');
const DoubtModel = require('../models/doubt');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // use env variable in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

// Setting up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/scits-portal-chts')
    .then(() => {console.log('Mongoose connected')})
    .catch(err => console.log(err));


 
 

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/courses', (req, res) => res.render('courses'));
app.get('/admission', (req, res) => res.render('admission'));
app.get('/sg', (req, res) => res.render('sg'));
app.get('/about', (req, res) => res.render('about'));
app.get('/HOD-LOGIN', (req, res) => res.render('hod-login'));

// Listen on port 
app.listen(port, () => console.log(`Server is running on port ${port}`));

//reading routes 
app.get('/readHodLogin',async(req,res)=> {
    const data = await HodModel.find();
    res.json(data);
}) 
app.get('/readFaculty',async(req,res)=> {
    const data = await FacultyModel.find();
    res.json(data);
}) 
app.get('/readStudent',async(req,res)=> {
    const data = await StudentModel.find();
    res.json(data);
}) 
app.get('/readDoubt',async(req,res)=> {
    const data = await DoubtModel.find();
    res.json(data);
}) 

    app.post('/HOD-LOGIN', async (req, res) => {
        const { user_name, password } = req.body;
    
        try {
            const check = await HodModel.findOne({ user_name, password });
    
            if (check) {
                req.session.isLoggedIn = true;
                req.session.user = user_name;
                req.session.role = 'hod';
                res.json({ success: true, redirectUrl: '/csm-hod-home' });
            } else {
                res.json({ success: false });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error" });
        }
    });
    
    function protectRoute(role) {
        return function (req, res, next) {
            if (req.session.isLoggedIn && req.session.role === role) {
                next();
            } else {
                res.redirect('/' + role.toUpperCase() + '-LOGIN');
            }
        };
    }
    

    app.get('/csm-hod-home', protectRoute('hod'),async (req, res) => {

        const fcsm = await StudentModel.find({year:'1',branch:'CSM'})
    const faiml = await StudentModel.find({year:'1',branch:'AIML'})
    const scsm = await StudentModel.find({year:'2',branch:'CSM'})
    const saiml= await StudentModel.find({year:'2',branch:'AIML'})
    const tcsm = await StudentModel.find({year:'3',branch:'CSM'})
    const taiml = await StudentModel.find({year:'3',branch:'AIML'})


        res.render('csm-hod', { user: req.session.user,fcsm,faiml,scsm,saiml,tcsm,taiml });
    });

    app.post('/csm-hod-home',async (req,res)=> {

        const {faculty_name,faculty_id,faculty_password,faculty_email} = req.body;
        const check = await FacultyModel.findOne({faculty_name : faculty_name,faculty_id:faculty_id,faculty_password:faculty_password,faculty_email:faculty_email});

        try{
        if(!check) {
            const data = new FacultyModel({faculty_name : faculty_name,faculty_id:faculty_id,faculty_password:faculty_password,faculty_email:faculty_email});
            await data.save();
            res.json({success : true,redirect : '/csm-hod-home'});
        }else {
            res.json({success : false})
        }
    }catch(err) {
        console.log(err);
    }

    })
    

app.get('/faculty-login',(req,res)=> {
    res.render('faculty-login')
});

let faculty_id_csm = '';

app.post('/faculty-login', async (req,res)=> {
    

    const {faculty_id,faculty_password} = req.body;
    const check = await FacultyModel.findOne({faculty_id:faculty_id,faculty_password:faculty_password});

    try{
    if(check) {
        req.session.isLoggedIn = true;
        req.session.user = faculty_id;
        faculty_id_csm = faculty_id;
        req.session.role = 'faculty';
        res.json({success : true,redirect : '/UAOS'});
    }else {
        res.json({success : false,redirect : '/faculty-login'})
    }
}catch(err) {
    console.log(err);
}

})  



app.get('/UAOS',protectRoute('faculty'),async (req,res)=> {

    const faculty = await FacultyModel.findOne({faculty_id:faculty_id_csm});

    const fcsm = await StudentModel.find({year:'1',branch:'CSM'})
    const faiml = await StudentModel.find({year:'1',branch:'AIML'})
    const scsm = await StudentModel.find({year:'2',branch:'CSM'})
    const saiml= await StudentModel.find({year:'2',branch:'AIML'})
    const tcsm = await StudentModel.find({year:'3',branch:'CSM'})
    const taiml = await StudentModel.find({year:'3',branch:'AIML'})

    const doubt = await DoubtModel.find();

    res.render('UAOS',{faculty,fcsm,faiml,scsm,saiml,tcsm,taiml,doubt});
});
 
app.post('/add-student', async (req, res) => {
    let { student_name, roll_number, branch, year, section,subject1,subject2,subject3,subject4,subject5 } = req.body;
        student_name = student_name.toUpperCase();
        roll_number = roll_number.toUpperCase();
        branch = branch.toUpperCase();
        section = section.toUpperCase();
        subject1 = subject1.toUpperCase();
        subject2 = subject2.toUpperCase();
        subject3 = subject3.toUpperCase();
        subject4 = subject4.toUpperCase();
        subject5 = subject5.toUpperCase();

    console.log(student_name,roll_number,branch,year,section,subject1,subject2,subject3,subject4,subject5);
  
    try {
      const existingStudent = await StudentModel.findOne({
        student_name,
        roll_number,
        branch,
        year,
      });
  
      if (!existingStudent) {
        const newStudent = new StudentModel({
          student_name,
          roll_number,
          branch,
          year,
          section,
          subjects: [subject1,subject2,subject3,subject4,subject5], // initialize array here
        });
        await newStudent.save();
        return res.json({ success: true, redirect: '/studentLogin' });
      } else {
        
        return res.json({ success: false, redirect: '/studentLogin' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });

app.post('/updateAttendance',async (req,res)=> {
    const {roll_number} = req.body;


   


    try{
    const data = await StudentModel.findOneAndUpdate({roll_number},{ $inc: { attended_classes: 1 } },{new:true});

    if(data){
        res.json({success : true,redirect:'/UAOS'});
        console.log(data)
    }else{
        res.json({success:false,redirect:'/UAOS'})
    }
}catch(err){
    console.log(err);
}




})  
app.post('/updateTotalClasses', async (req, res) => {
    const { students } = req.body;
    try {
        if (!students || !Array.isArray(students)) {
            return res.json({ success: false, message: "Invalid students data" });
        }

        // Update all students
        const updatePromises = students.map(student => {
            // Assuming student has an _id field or other unique identifier
            return StudentModel.updateOne(
                { roll_number: student.roll_number }, // or another unique field like roll_number
                { $inc: { total_classes: 1 } }
            );
        });

        // Wait for all updates to complete
        const results = await Promise.all(updatePromises);
        
        // Count successful updates
        const successfulUpdates = results.filter(r => r.modifiedCount === 1).length;
        
        if (successfulUpdates > 0) {
            res.json({ success: true, redirect: '/UAOS' });
        } else {
            res.json({ success: false, redirect: '/UAOS', message: "No students were updated" });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

app.get('/studentLogin',(req,res)=> {
    res.render('student-login');
})
 app.post('/studentLogin',async (req,res)=> {
    let {roll_number} = req.body;
    roll_number = roll_number.toUpperCase();
    console.log(roll_number)
    const data = await StudentModel.findOne({roll_number:roll_number});
    const doubt = await DoubtModel.find();
    if(data) {
        res.render('students',{data,doubt});
    }else {
        res.send('invalid credentials ! ')
    }
 })  

 app.post('/erase-data',async (req,res)=> {

    try{
    const delete1 = await FacultyModel.deleteMany({}).then(()=>console.log('data erased from faculty model')).catch(err=> console.log(err))
    const delete2 = await StudentModel.deleteMany({}).then(()=>console.log('data erased from student model')).catch(err=> console.log(err))
    const delete3 = await DoubtModel.deleteMany({}).then(()=>console.log('data erased from doubt model')).catch(err=> console.log(err))



        res.json({success : true,redirect : '/csm-hod-home'});
    }catch(err){
        res.json({success : false,redirect : '/csm-hod-home'});
        console.log(err);
    }
    
 })

 app.post('/mark-all-present', async (req, res) => {
    const { students } = req.body;
    console.log(students)
    try {
        if (!students || !Array.isArray(students)) {
            return res.json({ success: false, message: "Invalid students data" });
        }

        // Update all students
        const updatePromises = students.map(student => {
            // Assuming student has an _id field or other unique identifier
            return StudentModel.updateOne(
                { roll_number: student.roll_number }, // or another unique field like roll_number
                { $inc: { attended_classes: 1 } }
            );
        });

        // Wait for all updates to complete
        const results = await Promise.all(updatePromises);
        console.log(results)
        
        // Count successful updates
        //const successfulUpdates = results.filter(r => r.modifiedCount === 1).length;
        
        if (results) {
            res.json({ success: true, redirect: '/UAOS' });
        } else {
            res.json({ success: false, redirect: '/UAOS', message: "No students were updated" });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

app.post('/doubt-student', async (req, res) => {
    const { faculty_name, subject, doubt, roll_number } = req.body;
  
    try {
      const existingDoubt = await DoubtModel.findOne({ faculty_name, subject, doubt, roll_number });
  
      if (!existingDoubt) {
        const newDoubt = new DoubtModel({ faculty_name, subject, doubt, roll_number , clarified : false });
        await newDoubt.save();
        console.log('Saved:', newDoubt);
        res.send(`<script>alert('Doubt submitted!'); window.location.href = '/studentLogin';</script>`)
      } else {
        res.send(`<script>alert('some thing went wrong !'); window.location.href = '/studentLogin';</script>`)
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
app.post('/clarification',async (req,res) => {
    const {roll_number,faculty_name,subject,doubt,clarification} = req.body;

    try {
        const data = await DoubtModel.findOneAndUpdate({roll_number,faculty_name,subject,doubt,},{clarification : clarification,clarified : true},{new : true});
        if(data) {
            res.json({success : true})
        }else{
            res.json({success : false})
        }
    }catch(err) {
        console.log(err);
    } 
})

app.get('/unclarified-doubts', async (req, res) => {
    try {
      const doubts = await DoubtModel.find({ clarified: false });
      res.json(doubts);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  app.post('/delete-student',async (req,res)=> {
    const {roll_number} = req.body;
    try {
    const data = await StudentModel.findOneAndDelete({roll_number : roll_number});

    if(data) {
        res.json({success : true})
    }else {
        res.json({success : false})
    }

}catch(err) {
    console.log(err);
}
  })