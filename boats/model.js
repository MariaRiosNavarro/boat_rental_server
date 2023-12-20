import mongoose from "mongoose";

const boatsSchema = new mongoose.Schema({
  img: String,
  name: String,
  skipper: Boolean,
  type: String,
  subtype: String,
  material: String,
  price: Number,
  cabins: Number,
  bathrooms: Number,
  year: Number,
  description: String,
  meter: Number,
  airconditioner: Boolean,
  autopilot: Boolean,
  wifi: Boolean,
});

export const BoatModel = mongoose.model("boats", boatsSchema);
