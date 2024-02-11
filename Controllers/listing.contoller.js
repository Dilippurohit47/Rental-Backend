import Listing from "../models/listing.model.js";
import {deleteFromCloudinary, uploadCloudinary} from "../middlewares/Cloudinary.js"


export const create = async (req, res) => {

  try {
          /* Take the information from the form */
  const {
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    province,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    title,
    description,
    highlight,
    highlightDesc,
    price,
  } = req.body;

  const listingPhotos = req.files;



  if(!listingPhotos) { 
    return res.status(400).send("No file uploaded")
} 

const listingPhotoPaths = listingPhotos.map((file) =>file.path)

const cloudinaryResponse = await uploadCloudinary(listingPhotoPaths)


const photoUrls = cloudinaryResponse?.map(response =>response.secure_url)
const publicIds = cloudinaryResponse?.map(response =>response.public_id)
// console.log(cloudinaryResponse)
const newListing = new Listing({
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    province,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    listingPhotoPaths:photoUrls,
    title,
    description,
    highlight,
    highlightDesc,
    price,
    publicId:publicIds,
})

// console.log(newListing)
await newListing.save()

  res.status(200).json(newListing)  

  } catch (error) {
    res.status(409).json({
      message: "fail to create listing",
      error:error.message,
    })
  //  console.log(error)

  }
};


export const getListing = async(req,res) =>{

    const category = req.query

    try {
        let listings;
        if(category) {
    
            listings = await Listing.find(category).populate("creator");

        }else{
            listings = await Listing.find().populate("creator");
        }

        res.status(200).json({
            listings
        })

        
    } catch (error) {
        res.status(409).json({
            message: "fail to fetch listing",
            error:error.message,
          })
        //  console.log(error)
        
    }

}

export const ListingDetails = async(req,res) =>{
  try {
    
    const {listingId} = req.params

    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json({listing})

  } catch (error) {
    res.status(404).json({
      message : "Listing cannot be found!",error:error.message
    })
  }
}

export const searchListing = async(req,res) =>{
  const {search} =req.params;
  try {

    let listings = [];
    if(search ==="All"){
      listings = await Listing.find().populate("creator")

    }else{
      listings = await Listing.find({
        $or:[
     
     {  category : {$regex: search , $options: "i"} },
     {  title : {$regex: search , $options: "i"} }

        ]
      }).populate("creator")
    }

    return res.status(200).json(listings)

  } catch (error) {
    res.status(404).json({
      message : "Listing cannot be found!",error:error.message
    })
  }

}


export const DeleteListng = async(req,res) =>{

  const  {id} = req.params;

  try {

    const list = await Listing.findById(id)
    // console.log("lolololo")

    if(!list){
      return res.status(400).json({
        success : false,
        message:"Product is already deleted or id is not valid",
      })
    }


    const imagepath = list?.publicId?.map(item =>item)
    // console.log("imagepath",imagepath)
    await deleteFromCloudinary(imagepath);

   await list.deleteOne();
   return res.status(210).json({
    success : true,
    message:"Product is successfully deleted"
  })

    
  } catch (error) {
     res.status(404).json({
      message : "error in deleting listing!",error:error.message
    })
  }

}