// const express=require('express');
// const app=express();
// const cors=require('cors')
// const User=require('./models/User')
// const Post=require('./models/Post')
// const mongoose=require('mongoose')
// const bcrypt=require('bcryptjs')
// const jwt=require('jsonwebtoken');
// const cookieParser =require('cookie-parser');
// const multer=require('multer')
// const uploadMiddleware=multer({dest:'uploads/'})
// const fs=require('fs')


// const salt=bcrypt.genSaltSync(10);
// const secret='732t8qgwqudhqwd8hhd9'

// app.use(cookieParser());
// app.use(cors({credentials:true,origin:'http://localhost:3000'}))
// app.use(express.json())
// app.use('/uploads',express .static(__dirname+'/uploads'))


// mongoose.connect('mongodb://localhost:27017/blog')

// app.post('/signup',async (req,res)=>{
//     try{
//         const {username,password}=req.body;
//         const userDOC=await User.create
//         ({username,
//             password:bcrypt.hashSync(password,salt),})
//         res.json(userDOC)
//     }catch(e){
//         res.status(404).json(e);
//     }
    
// });

// app.post('/login',async(req,res)=>{

// const {username,password}=req.body;
// const userDOC=await User.findOne({username})
// if (!userDOC) {
//   return res.status(400).json('User not found');
// }

// const passOk=bcrypt.compareSync(password,userDOC.password)
// if(passOk){
//     //logged in
//     jwt.sign({username,id:userDOC._id},secret,{},(error,token)=>{
//     if(error)throw error;
//     res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' }).json({
//       id:userDOC._id ,
//       username, 
//     });

//     })
// }else{
//     res.status(400).json('wrong credentials');
//     }

// })


// app.get('/profile',(req,res)=>{
//     const {token}=req.cookies;
//     jwt.verify(token,secret,{},(err,info) =>{
//    if(err) throw err;
//    res.json(info)
//     })
// })

// app.post('/logout',(req,res)=>{
//     res.cookie('token','').json('ok');
// })


// app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
//     const {originalname,path}=req.file;
//     const parts=originalname.split('.');
//     const ext=parts[parts.length-1];
//     const newPath=path+ '.'+ext
//     fs.renameSync(path,newPath)
//     const {token}=req.cookies;

//     jwt.verify(token,secret,{},async(err,info) =>{
//         if(err) throw err;
//         const {title,summary,content}=req.body;

//         const postDoc= await Post.create({
//         title,
//         summary,
//         content,
//         cover:newPath, 
//         author:info.id
//             })
//             res.json(postDoc)

//          })
    


// })
// app.get('/post',async(req,res)=>{
//     res.json(await Post.find()
//     .populate('author',['username'])
// .sort({createdAt:-1})
// .limit(20)
// );     
// })

// app.listen(4000);
// //mongodb+srv://danidude67:gOqs5dYrWev4EEfs@danicluster.rnzlzyq.mongodb.net/?retryWrites=true&w=majority&appName=DaniCluster
// //gOqs5dYrWev4EEfs
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/route'); // Import the routes module

const app = express();

mongoose.connect('mongodb://localhost:27017/blog');

const port = 4000;

// Middleware
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads')); // Serves static files in /uploads

// Use Routes
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
