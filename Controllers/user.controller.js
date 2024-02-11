import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { singleUpload } from "../middlewares/Cloudinary.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    // path for uploaded file
    const profileImagepath = profileImage.path;
    const profileUpload =  await singleUpload(profileImagepath)
    console.log(profileUpload)


    // console.log("profileimage",profileImagepath)

    // user exist
    const existinguser = await User.findOne({ email });
    if (existinguser) return res.status(409).json({ message: "user already exist" });

    // password hashing
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagepath:profileUpload?.secure_url,
    });


    // save the new user
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      // Duplicate email error ---just delete or drop that user ccollection and create again problem solved
      return res.status(400).json({     success:false , error: "Duplicate email", message: "Email already exists" });} 
    console.log(error);
    res.status(500).json({
        success:false,
        error:"Registration failed ",
        message:error.message
   })
  }
};


export const login = async(req,res) =>{
  try {
    
    const {email , password} = req.body

    const user = await User?.findOne({email})
console.log(user?.email , user?.password)
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User doesnt exist"
      })
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"Invalid credentials"
      })
    }

    const token = jwt.sign({id:user._id} ,process.env.JWT_SECRET)
    delete user.password

    res.status(200).json({
      success:true,
      message:`welcome back ${user?.firstName}`,
      token , user})

  } catch (error) {
    return res.status(500).json({
      error:error.message
    })

  }
}