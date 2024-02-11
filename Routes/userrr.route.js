import express from "express";
import Booking from "../models/Bookings.model.js";
import User from "../models/User.model.js";
import Listing from "../models/listing.model.js";

const app = express.Router();

// get trip list

app.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Booking.find({ customerId: userId }).populate([
      { path: "customerId" },
      { path: "hostId" },
      { path: "listingId" },
    ]);
    console.log(trips);

    res.status(202).json(trips);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find trips!", error: err.message });
  }
});

//whish list controller

app.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    const user = await User.findById(userId);
    const listing = await Listing.findById(listingId).populate("creator");

    const favouriteListing = user?.wishList.find(
      (item) => item?._id.toString() === listingId
    );


    if (favouriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );
      await user.save();
      res
        .status(200)
        .json({
          message: "Listing is removed from wish list",
          wishList: user.wishList,
        });
    } else {
      user.wishList.push(listing);
      await user.save();

      res.status(200).json({
        message: "Listing is added to wish list",
        wishList: user.wishList,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      error: error.message,
    });
  }
});



// get property list
app.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params;

    const properties = await Listing.find({creator: userId}).populate("creator");


    res.status(202).json(properties);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find properties!", error: err.message });
  }
});






// rs
app.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;

    const reservation = await Booking.find({hostId: userId}).populate("customerId hostId  listingId");


    res.status(202).json(reservation);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "Can not find reservation!", error: err.message });
  }
});





export default app;