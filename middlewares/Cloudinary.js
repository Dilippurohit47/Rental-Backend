import {v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { env } from "process"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY_CLOUD, 
    api_secret:process.env.API_SECRET_CLOUD,
})

export const uploadCloudinary  = async (listingPhotoPaths) =>{
    console.log(  "local" , listingPhotoPaths)
    try {
        const uploadedFiles = [];

        for (const localFilePath  of listingPhotoPaths){
        if (!localFilePath) continue;
        const response  = await cloudinary.uploader.upload(localFilePath);
        fs.unlinkSync(localFilePath );
        uploadedFiles.push(response);
        }
        console.log("file is upload on cloudinary")
        return uploadedFiles;
    } catch (error) {
        console.log("error in clouds ",error)
        fs.unlinkSync(localFilePath );
    }
}


export const singleUpload = async(singlePath) =>{
    try {
        
        if(!singlePath) return null;

        const response = await cloudinary.uploader.upload(singlePath)
console.log("profile image is uploaded on cloudinary");
fs.unlinkSync(singlePath);
return response

    } catch (error) {
        console.log("error in clouds ",error)
        fs.unlinkSync(singlePath);
    }
}

export const deleteFromCloudinary = async(imageArrayPath) =>{
    const deletedResult  = [];
    try {
        for (const singlePath of imageArrayPath){
            if(!singlePath) continue;
            const result = await cloudinary.uploader.destroy(singlePath)
            deletedResult.push(result)
        }

        console.log("photos are deleted from clodudinary",deletedResult);
        return deletedResult;
    } catch (error) {
        console.log("error in deleting image from cloudinary" , error)
        throw error;
    }
}