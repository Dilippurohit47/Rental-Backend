import Booking from "../models/Bookings.model.js";
import User from "../models/User.model.js";

export const CreateBooking = async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } =
      req.body;

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
    });

    const booking = await newBooking.save();

    const user = await User.findById(customerId);
    user?.tripList.push(booking);

    await user.save();

    res.status(200).json({
      message: "Booking created successfully",
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed ot create new booking",
      error: error.message,
    });
  }
};

export const getBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await Booking.find({ customerId: id });

    if (!bookings) {
      return res.status(400).json({
        message: "Cannot find bookings",
      });
    }
    res.status(200).json({
      message: "Bookings find successfully",
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Bookings not find ",
    });
  }
};

export const DeleteBooking = async (req, res) => {
  const { id } = req.params;
  const _id = id;
  try {
    let booking = await Booking.findById(_id);
    await booking.deleteOne();
    return res.status(210).json({
      success: true,
      message: "Booking is successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error in deleting booking",
      error: error.message,
    });
  }
};
