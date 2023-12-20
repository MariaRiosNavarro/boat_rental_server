import { BoatModel } from "./model.js";
import fs from "fs/promises";

export const getAllBoats = async (req, res) => {
  const boats = await BoatModel.find();
  console.log("____allBoats________⛵︎", boats);
  res.json(boats);
};

export const getOneBoat = async (req, res) => {
  const { id } = req.params;
  const boat = await BoatModel.findOne({ _id: id });
  console.log("____getOne________⛵︎", boat);
  res.json(boat);
};

export const addOneBoat = async (req, res) => {
  const boat = new BoatModel(req.body);
  if (req.file) {
    boat.img = req.file.path;
  }
  console.log("____addOne________⛵︎", boat);
  await boat.save();
  res.end();
};

export const removeOneBoat = async (req, res) => {
  const { id } = req.params;
  const deletedBot = await BoatModel.findOneAndDelete({ _id: id });
  console.log("____deletedOne________⛵︎", deletedBot);
  res.end();
};

export const editOneBoat = async (req, res) => {
  const { id } = req.params;

  //save new data & add image if it is in the request
  const newBoatData = req.body;
  if (req.file) {
    return (newBoatData.img = req.file.path);
  }
  let newImage = newBoatData.img;

  //check if old Data has a Image
  const oldData = await BoatModel.findById(id);
  const oldImage = oldData.img;

  //Update with id: Mongoose assumes by default that the field that
  //acts as the unique identifier is _id in MongoDB
  //documents. This is a convention set by Mongoose and MongoDB.
  // also we dont need to write _id:id

  const updateBoat = await BoatModel.findByIdAndUpdate(id, newBoatData, {
    new: true,
  });

  //remove the old image if the req has a new image

  if (newImage && oldImage && newImage !== oldImage) {
    await fs.unlink(oldImage);
  } else {
    console.log("Image don´t change");
  }

  console.log("____updateBoat________⛵︎", updateBoat);
  res.end();
};
