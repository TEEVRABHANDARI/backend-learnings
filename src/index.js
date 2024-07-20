
import connectDB from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";


// now we have to config the dotenv to use it 

dotenv.config({
    path:'./.env' // . ki mistake thi
})

//jeetni jaldi application load ho vaise hi sabko uska access mil jaye
// require('dotenv').config({path: './env'}) 
//but causes inconsistency

app.on("error",(error)=>{
    throw error 
})
// calling connection to DB
connectDB() //promise hai ye
//promises return hota hai 
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at the port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongodB connection failed ",err)
})

// APPROACH 1 FOR CONNECTING DB


// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express"

// const app = express()
// // kabhi bhi database ek line mein connect nhi hota
// //iffy better approach
// (async ()=> {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         //listeners app ke pass hote hai tho
//         app.on("error",(error)=>{
//             throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT} `)
//         })
//     }
//     catch(error){
//         console.log("ERROR",error)
//         throw err
//     }
// })()