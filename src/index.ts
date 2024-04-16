import express from 'express';
import cors from 'cors';
const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.DB_URL}`); // 8626
const app=express();
app.use(express.json());
app.use(cors());
const mongoose = require('mongoose');
console.log(process.env.DB_URL);
mongoose.connect(process.env.DB_URL);

const Employee1=new mongoose.Schema({
    name: String,
    age:Number,
    Department:String,
    title:String, 
    DOB:String
})

const Employee= mongoose.model('Employee', Employee1);


app.post('/',async (req,res)=>{
    try{
        const e=await Employee.create({
            name:req.body.name,
            age:req.body.age,
            Department:req.body.Department,
            title:req.body.title,
            DOB:req.body.DOB
    
        });
        return res.json({e})
    }catch(e){
        return res.status(400).json({msg:e})
    }
   
});

app.get("/",async (req,res)=>{
    try{
        const response=await Employee.find({});
        return res.json(response);
    }
    catch(e)
    {
        return res.status(400).json({msg:e});
    };
    
});

app.put("/",async (req,res)=>{
    try{
        const id=req.body._id;
        await Employee.updateOne({ _id: id}, req.body);
        return res.json({msg:"updated successfully"});
    }catch(e){
        return res.status(403).json({er:e});
    }
})

app.get("/bulk",async (req,res)=>{
    const nameFilter=req.query.name || "";
    const titleFilter=req.query.title || "";
    console.log(nameFilter);
    console.log(titleFilter);
    try{
        let r="";
        if(nameFilter=="" && titleFilter!=""){
            console.log("first")
            r=await Employee.find({title:{
                "$regex": titleFilter,$options: 'i'
            }})
           
        }
        else if(nameFilter!="" && titleFilter==""){
            console.log("second")
            r=await Employee.find({name:{
                "$regex": nameFilter,$options: 'i'
            }})
        }
        else
        {
            console.log("third")
            r=await Employee.find({ $and: [{
            name: {
                "$regex": nameFilter
            }
            }, {
                title: {
                    "$regex": titleFilter
                }
            }]});
        }
       // console.log(r);
        return res.json(r);
    }
    catch(e)
    {
        console.log(e);
        return res.status(400).json(e)
    }
   
})

app.listen(3000,()=>{
    console.log("listening on port 3000");
})