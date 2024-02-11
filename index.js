import express from "express";

import dotenv from "dotenv";

import cors from "cors";
import { connectDb } from "./middlewares/connectDb.js";

import UserRoute from "./Routes/user.route.js"
import ListingRoute from "./Routes/listing.route.js"
import BookingRoute from "./Routes/booking.route.js"

import UserrRoute from "./Routes/userrr.route.js"
import morgan from "morgan";

connectDb();
dotenv.config();
const app = express();
app.use(morgan("dev"))
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


app.use("/auth" , UserRoute)
app.use("/properties" , ListingRoute)
app.use("/bookings" , BookingRoute)
app.use("/users" , UserrRoute)


app.get("/",(req,res) =>{
    res.send("hello from rentals this time")
})

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server is  successfully started on http://localhost:${port}`)
})