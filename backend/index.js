
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
import { connectDb } from './utils/connectDb.js'
import userRoute from './routes/userRoute.js'
import postRoute from './routes/prostRoute.js'
import messageRoute from './routes/messageRoute.js'
import {app , server } from './socket/socket.js'
dotenv.config({})


const corsOption = {
    origin : "http://localhost:5173",
    credentials : true
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOption))


app.use("/api/v1/user" , userRoute)
app.use("/api/v1/post" , postRoute)
app.use("/api/v1/message", messageRoute);



server.listen(3000, () => {
    console.log("app is listen on 3000 port");
    connectDb()
})