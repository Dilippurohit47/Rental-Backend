import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config()

const url = process.env.MONGO_URL; 
export const connectDb =()=>{
    mongoose.connect(url ,{
        dbName: "rentals",
        useNewUrlParser:true,

    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`) )
    .catch((e) => console.log(e))
};