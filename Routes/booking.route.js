import express from "express"
import  {CreateBooking, DeleteBooking, getBooking}  from "../Controllers/booking.controller.js"

const app = express.Router();

app.post("/create",CreateBooking)
app.get("/:id",getBooking)

app.delete("/:id",DeleteBooking)


export default app;