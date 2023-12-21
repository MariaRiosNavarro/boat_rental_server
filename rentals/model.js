import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  //only Reference
  referenceBootId: mongoose.Schema.Types.ObjectId,
  //complete Document
  documentBoat: { type: mongoose.Types.ObjectId, ref: "boats" },
  username: String,
  daystart: Date,
  dayend: Date,
  price: Number,
  bonus: Boolean,
});

export const RentalModel = mongoose.model("rental", rentalSchema);
