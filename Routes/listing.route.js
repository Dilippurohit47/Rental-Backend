import express from "express"

 
const app = express.Router();


import multer from "multer";
import { DeleteListng, create, getListing, searchListing } from "../Controllers/listing.contoller.js";
import { ListingDetails } from "../Controllers/listing.contoller.js";

const storage = multer.diskStorage({
   destination:function(req,file,cb){
       cb(null,"public/uploads/")
   },
   filename:function(req,file,cb){
       cb(null,file.originalname)
   }
})

export const upload = multer({storage})

app.post("/create",upload.array("listingPhotos"),create)
app.get("/",getListing)
app.get("/:listingId",ListingDetails)
app.get("/search/:search",searchListing)
app.delete("/delete/:id",DeleteListng)


export default app;