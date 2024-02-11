import express, { Router } from "express"
// import jwt from "jsonwebtoken"
// import multer from "multer";
// import User from "../models/User.model";
import { upload } from "../middlewares/multer.js";
import { register,login } from "../Controllers/user.controller.js";


const app = express.Router();

/* user register api */

app.post("/register",upload,register)
app.post("/login",login)

export default app;