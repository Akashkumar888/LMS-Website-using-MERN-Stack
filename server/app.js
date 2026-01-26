import express from 'express'
import cors from 'cors'


//Initialize Express
const app=express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes 
app.get('/',(req,res)=>{
  res.send("API Working.")
});


export default app;