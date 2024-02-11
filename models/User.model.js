import mongoose  from "mongoose";

const UserSchema = new mongoose.Schema({

    firstName : {
        type:String,
        required:true,
    },

    lastName : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        unique:[true , "email already exist "],
        
        required:[true, "please enter email"],
    },
    password : {
        type:String,
        required:true,
    },
    profileImagepath: {
        type:String,
        default:"",
    },
    tripList:{
        type :Array,
        default:[],
    },
    wishList:{
        type :Array,
        default:[],
    },
    propertyList:{
        type :Array,
        default:[],
    },
    reservationList:{
        type :Array,
        default:[],
    }

},{timestamps:true})


const User = mongoose.model("User",UserSchema)

export default User;