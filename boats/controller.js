import { BoatModel } from "./model.js";
import fs from "fs/promises";

// --------------------------------------------------------------------GET ALL

export const getAllBoats = async (req, res) => {
  try {
    //Wait & recibe Data
    const boats = await BoatModel.find();
    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: "Boats successfully retrieved ✅",
        data: boats,
      });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all boats -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving all boats ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------GET ONE

export const getOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    //Wait & recibe Data
    const boat = await BoatModel.findOne({ _id: id });
    // No Response handling

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }
    //Confirmation back  & data to frontend
    res.status(200).json({
      success: true,
      message: `Movie with id= ${id} sucessfully retrieved ✅`,
      data: boat,
    });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all boats -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving one boat ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------ADD ONE

export const addOneBoat = async (req, res) => {
  try {
    const boat = new BoatModel(req.body);
    if (req.file) {
      boat.img = req.file.path;
    }
    // Check if at least the boat name is present
    // if (!boat.boatname) {
    //   return res.status(400).json({ error: "Boat Name is necessary." });
    // }
    // Save the new Boot in db
    await boat.save();

    //Confirmation back

    res
      .status(201)
      .json({
        success: true,
        message: "Boat successfully added ✅",
      })
      .end();

    // Error Handling
  } catch (error) {
    // Handle errors
    console.error("Error adding one boat -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error adding one boat ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------DELETE ONE

export const removeOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    // Save Boat to remove later the img
    const boat = await BoatModel.findOne({ _id: id });
    // Remove the Boot
    const deletedBot = await BoatModel.findOneAndDelete({ _id: id });

    // handle if data is not deleted
    // if (!deletedBot.deletedCount) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Boat not found" });
    // }

    // delete image
    if (boat) {
      await fs.unlink(boat.img);
    }

    //sucess true
    console.log("____deletedOne________⛵︎", deletedBot);

    res.status(200).json({
      success: true,
      message: `Movie with id= ${id} successfully deleted ✅`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing one boat❌", error });
  }
};

// --------------------------------------------------------------------EDIT ONE

export const editOneBoat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "BOAT ID is missing" });
    }

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

    // Update Data

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

    //  Confirmation back
    res.status(201).json({
      success: true,
      message: `Boat with id= ${id} successfully updated ✅`,
      data: newBoatData,
    });
  } catch (error) {
    // Handle errors
    console.error("Error editing one boat -------🦑", error);
    res
      .status(500)
      .json({ success: false, message: "Error editing one boat ❌", error });
  }
};
