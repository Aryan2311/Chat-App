import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/users.routes.js";
import connect_db from "./db/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./socket/socket.js";



dotenv.config();

const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter )
app.use('/api/message', messageRouter )
app.use('/api/users', userRouter )

server.listen(port, ()=> {
    connect_db();
    console.log(`App Listening on Port ${process.env.PORT}`)});