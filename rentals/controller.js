import { RentalModel } from "./model.js";

export const addOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalInfo = req.body;

    if (!rentalInfo) {
      throw new Error("Request body is undefined or not an object.");
    }

    if (rentalInfo && rentalInfo.daystart) {
      rentalInfo.daystart = new Date(rentalInfo.daystart);
    }

    rentalInfo.referenceBootId = id;
    rentalInfo.documentBoat = id;

    console.log("____addOneRental________📅", rentalInfo);

    const rental = new RentalModel(rentalInfo);
    await rental.save();
    res.end();
  } catch (error) {
    console.error("Error adding one rental -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const getOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    const boatDoc = await RentalModel.findById(id)
      .populate("documentBoat")
      .exec();

    console.log("____getOneRental________📅", boatDoc);
    res.json({ isRented: !!boatDoc, boat: boatDoc });
  } catch (error) {
    console.error("Error getting one rental -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const getAllRental = async (req, res) => {
  try {
    const rentals = await RentalModel.find();
    console.log("____getAllRental________📅", rentals);
    res.json(rentals);
  } catch (error) {
    console.error("Error getting all rentals -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const removeOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRent = await RentalModel.findByIdAndDelete(id);
    console.log("____removeOneRental________📅", deletedRent);
    res.end();
  } catch (error) {
    console.error("Error removing one rental -------🦑", error);
    res.status(500).send("Internal server error");
  }
};

export const editOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    const newRentalData = req.body;

    // Parse the date string in the new rental data
    if (newRentalData && newRentalData.daystart) {
      newRentalData.daystart = new Date(newRentalData.daystart);
    }

    const updateRental = await RentalModel.findByIdAndUpdate(
      id,
      newRentalData,
      {
        new: true,
      }
    );

    console.log("____editOneRental________📅", updateRental);
    res.end();
  } catch (error) {
    console.error("Error editing one rental -------🦑", error);
    res.status(500).send("Internal server error");
  }
};
