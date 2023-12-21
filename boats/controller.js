import { BoatModel } from "./model.js";
import { RentalModel } from "../rentals/model.js";
import fs from "fs/promises";

export const getAllBoats = async (req, res) => {
  try {
    const boats = await BoatModel.find();
    console.log("____allBoats________⛵︎", boats);
    res.json(boats);
  } catch (error) {
    console.error("Error retrieving all boats -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const getOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    const boat = await BoatModel.findOne({ _id: id });
    console.log("____getOne________⛵︎", boat);
    res.json(boat);
  } catch (error) {
    console.error("Error retrieving one boat -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const addOneBoat = async (req, res) => {
  try {
    const boat = new BoatModel(req.body);
    if (req.file) {
      boat.img = req.file.path;
    }
    console.log("____addOne________⛵︎", boat);
    await boat.save();
    res.end();
  } catch (error) {
    console.error("Error adding one boat -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const removeOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    //handle delete image
    const boat = await BoatModel.findOne({ _id: id });

    const deletedBot = await BoatModel.findOneAndDelete({ _id: id });

    if (boat) {
      await fs.unlink(boat.img);
    }

    console.log("____deletedOne________⛵︎", deletedBot);
    res.json(deletedBot);
    // res.end();
  } catch (error) {
    console.error("Error removing one boat -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const editOneBoat = async (req, res) => {
  try {
    const { id } = req.params;

    //save new data & add image if it is in the request
    const newBoatData = { ...req.body };

    let newImage;

    if (req.file) {
      newImage = req.file.path;
      newBoatData.img = newImage;
    }

    //check if old Data has a Image
    const oldData = await BoatModel.findById(id);
    const oldImage = oldData.img;

    console.log("oldIMG", oldImage);

    //Update with id: Mongoose assumes by default that the field that
    //acts as the unique identifier is _id in MongoDB
    //documents. This is a convention set by Mongoose and MongoDB.
    // also we dont need to write _id:id
    console.log("Boat ID:----------------", id);
    console.log("New Boat Data:---------------", newBoatData);

    const updateBoat = await BoatModel.findByIdAndUpdate(id, newBoatData, {
      new: true,
    });

    console.log("Updated Boat:", updateBoat);

    // remove the old image if the req has a new image
    // error handling no oldimage need it

    if (newImage && oldImage) {
      await fs.unlink(oldImage);
    } else {
      console.log("Image don´t change");
    }

    console.log("____updateBoat________⛵︎", updateBoat);
    res.json(updateBoat);
  } catch (error) {
    console.error("Error editing one boat -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

//------------------------------------

export const getFreeBoatsOnDate = async (req, res) => {
  try {
    const requestedDate = new Date(req.params.date);

    // Calculate the next date to create a range for reservations- ONLY ONE DAY RENTAL
    const nextDate = new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000);

    // Filter reservations on the specified one date for ONE DAY range in RENTAL collection
    const reservationsOnDate = await RentalModel.find({
      daystart: { $gte: requestedDate, $lt: nextDate },
    });

    // Extract boats document with reservations on the specified date
    const boatsWithReservations = reservationsOnDate.map(
      (reservation) => reservation.documentBoat
    );

    // Find boats that are not in the list of reserved boats: search in Boat Model witch id is NOT in boatsWithReservations
    const freeBoatsOnDate = await BoatModel.find({
      _id: { $nin: boatsWithReservations },
    });

    res.json(freeBoatsOnDate);
  } catch (error) {
    console.error(
      `Error retrieving free boats on the specified date:${requestedDate} -------🦑`,
      error
    );
    res.status(500).send("Internal server error");
  }
};

export const getAllNotRentedBoats = async (req, res) => {
  try {
    const allReservations = await RentalModel.find();

    // Extract boats with reservations
    const boatsWithReservations = allReservations.map(
      (reservation) => reservation.documentBoat
    );

    // Find boats that are not in the list of reserved boats
    const boatsWithoutReservations = await BoatModel.find({
      _id: { $nin: boatsWithReservations },
    });

    res.json(boatsWithoutReservations);
  } catch (error) {
    console.error("Error retrieving boats without reservations:", error);
    res.status(500).send("Internal server error");
  }
};
