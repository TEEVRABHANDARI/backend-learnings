import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
})) // read DOCS 

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended:true,limit: "16kb"}))

// phele hume body parser use karna padhta hai 
// file uploading ke liye multer hota hai 

app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'

//http://localhost:8000/api/v1/users/register
app.use("/api/v1/users",userRouter)

export {app};