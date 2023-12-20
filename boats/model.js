import mongoose from "mongoose";

const boatsSchema = new mongoose.Schema({
  img: String,
  boatname: String,
  skipper: Boolean,
  boattype: String,
  boatsubtype: String,
  material: [String],
  price: Number,
  cabins: Number,
  bathrooms: Number,
  year: Number,
  description: String,
  meter: Number,
  airconditioner: Boolean,
  autopilot: Boolean,
  wifi: Boolean,
  hotwater: Boolean,
});

export const BoatModel = mongoose.model("boats", boatsSchema);
