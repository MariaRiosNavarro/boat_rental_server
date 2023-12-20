import { BoatModel } from "../boats/model.js";
import { RentalModel } from "./model.js";

export const addOneRental = async (req, res) => {
  const { id } = req.params;

  const rentalInfo = req.body;
  rentalInfo.referenceBootId = id;
  rentalInfo.documentBoat = id;

  const rental = await RentalModel(rentalInfo);
  console.log("____addOneRental________📅", rental);
  await rental.save();
  res.end();
};

export const getOneRental = async (req, res) => {
  const { id } = req.params;

  const boatDoc = await RentalModel.find({ _id: id })
    .populate("documentBoat")
    .exec();

  console.log("____getOneRental________📅", boatDoc);
  res.json({ isRented: boatDoc.length !== 0, boat: boatDoc });
};

export const getAllRental = async (req, res) => {
  const rentals = await RentalModel.find();
  console.log("____getAllRental________📅", rentals);
  res.json(rentals);
};

export const removeOneRental = async (req, res) => {
  const { id } = req.params;
  const deletedRent = await BoatModel.findByIdAndDelete({ _id: id });
  console.log("____removeOneRental________📅", deletedRent);
  res.end();
};

export const editOneRental = async (req, res) => {
  const { id } = req.params;
  const newRentalData = req.body;
  const updateRental = await RentalModel.findByIdAndUpdate(id, newRentalData, {
    new: true,
  });
  console.log("____editOneRental________📅", updateRental);
  res.end();
};
