import { RentalModel } from "./model.js";
import { BoatModel } from "../boats/model.js";

// --------------------------------------------------------------------ADD ONE

export const addOneRental = async (req, res) => {
  try {
    //save Boat Id referenceBootId & rentalInfo. New Id is in this request created, for the reservation
    const { id } = req.params;

    const rentalInfo = req.body;

    if (!rentalInfo) {
      throw new Error("Request body is undefined or not an object.");
    }

    // handle date for start of the reservation

    if (rentalInfo && rentalInfo.daystart) {
      rentalInfo.daystart = new Date(rentalInfo.daystart);
    }

    // handle date for end of the reservation

    if (rentalInfo && rentalInfo.dayend) {
      rentalInfo.dayend = new Date(rentalInfo.dayend);
    }

    // Add the id of the params as value for the reference & doc

    rentalInfo.referenceBootId = id;
    rentalInfo.documentBoat = id;

    //save

    const rental = new RentalModel(rentalInfo);

    await rental.save();

    //Confirmation back
    res
      .status(201)
      .json({
        success: true,
        message: "Reservation successfully added ✅",
      })
      .end();
    // Error Handling
  } catch (error) {
    // Handle errors
    console.error("Error adding one Reservation -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error adding one Reservation ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------GET ONE

export const getOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    //Wait & recibe Data & populate
    const boatDoc = await RentalModel.findById(id)
      .populate("documentBoat")
      .exec();

    if (!boatDoc) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    //Confirmation back  & data to frontend

    res.status(200).json({
      isReserved: !!boatDoc,
      success: true,
      boat: boatDoc,
      message: `Boat with id= ${id} sucessfully retrieved ✅`,
    });
  } catch (error) {
    console.error("Error getting one reservation-------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving one reservation ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------GET ALL

export const getAllRental = async (req, res) => {
  try {
    //Wait & recibe Data
    const rentals = await RentalModel.find().populate("documentBoat").exec();
    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: "Reservations successfully retrieved ✅",
        data: rentals,
      });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all Reservations -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving all Reservations ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------GET ALL + Date

export const getAllRentalsFromADate = async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const reservationsOnDate = await RentalModel.find({
      $or: [
        // Reservation starts on or after the specified date
        { daystart: { $gte: date } },
        // Reservation ends on or after the specified date
        { dayend: { $gte: date } },
      ],
    }) // Reservation start date is greater than or equal to the specified start date.
      .populate("documentBoat")
      .exec();

    //Confirmation back & data to frontend
    res.status(200).json({
      success: true,
      message: "Reservations successfully retrieved ✅",
      data: reservationsOnDate,
    });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all Reservations -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving all Reservations ❌",
      error,
    });
  }
};

//--------------------------------------------------------------------DELETE ONE

export const removeOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    // Remove the Reservation
    await RentalModel.findByIdAndDelete(id);

    //sucess true
    res.status(200).json({
      success: true,
      message: `Reservation with id= ${id} successfully deleted ✅`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing one boat❌", error });
  }
};

// --------------------------------------------------------------------EDIT ONE

export const editOneRental = async (req, res) => {
  try {
    const { id } = req.params;
    const newRentalData = req.body;

    // Parse the date string in the new rental data
    if (newRentalData && newRentalData.daystart) {
      newRentalData.daystart = new Date(newRentalData.daystart);
    }
    // Parse the date string in the new rental data
    if (newRentalData && newRentalData.dayend) {
      newRentalData.dayend = new Date(newRentalData.dayend);
    }
    // update Data
    const updateRental = await RentalModel.findByIdAndUpdate(
      id,
      newRentalData,
      {
        new: true,
      }
    );

    //  Confirmation back
    res.status(201).json({
      success: true,
      message: `Reservation with id= ${id} successfully updated ✅`,
      data: newRentalData,
    });
  } catch (error) {
    // Handle errors
    console.error("Error editing one Reservation -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error editing one Reservation  ❌",
      error,
    });
  }
};

//# --------BOATS + RENTALS combined ROUTES---------------------------------------------------------------------
//# ---------------------------------------BOATS + RENTALS combined ROUTES--------------------------------------
//# ----------------------------------------------------------------------BOATS + RENTALS combined ROUTES-------

// ----------------------------------------------------------------
// ---------------------------------GET ALL Boats------------------
// ----------------------------------------------------------------

//! ------------ get all the boats without any reservation---------------------------get all the boats without any reservation

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

    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: "Free Boats successfully retrieved ✅",
        data: boatsWithoutReservations,
      });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving Free Boats -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving Free Boats❌",
      error,
    });
  }
};

//! ------------get all the boats with a reserve in a given period of time.---------------------get all the boats with a reserve in a given period of time.

export const getRentedBoatsOnPeriod = async (req, res) => {
  try {
    const startDate = new Date(req.params.start);
    const endDate = new Date(req.params.end);

    // Filter reservations that overlap with the specified date range in RENTAL collection
    const reservationsOnDate = await RentalModel.find({
      // Use the $or operator to find documents that match any of the specified conditions.
      $or: [
        // Condition 1: Reservation starts and ends within the specified date range.
        {
          $and: [
            { daystart: { $gte: startDate } }, // Reservation start date is greater than or equal to the specified start date.
            { daystart: { $lte: endDate } }, // Reservation end date is less than or equal to the specified end date.
          ],
        },
        // Condition 2: Reservation ends within the specified date range.
        {
          $and: [
            { dayend: { $gte: startDate } }, // Reservation end date is greater than or equal to the specified start date.
            { dayend: { $lte: endDate } }, // Reservation end date is less than or equal to the specified end date.
          ],
        },
        // Condition 3: Reservation spans the entire specified date range.
        {
          $and: [
            { daystart: { $lte: startDate } }, // Reservation start date is less than or equal to the specified start date.
            { dayend: { $gte: endDate } }, // Reservation end date is greater than or equal to the specified end date.
          ],
        },
      ],
    })
      .populate("documentBoat")
      .exec();

    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: `Reserved boats from ${req.params.start} to ${req.params.end}  successfully retrieved ✅`,
        data: reservationsOnDate,
      });
  } catch (error) {
    // Handle errors
    console.error(
      `Error retrieving all Reserved boats from ${req.params.start} to ${req.params.end}-------🦑`,
      error
    );
    res.status(500).json({
      success: false,
      message: `Error retrieving all Reserved boats from ${req.params.start} to ${req.params.end} ❌`,
      error,
    });
  }
};

//! ------------get all free boats in a given period of time.---------------------get all free boats in a given period of time

export const getFreeBoatsOnPeriod = async (req, res) => {
  try {
    const startDate = new Date(req.params.start);
    const endDate = new Date(req.params.end);

    // Filter reservations that overlap with the specified date range in RENTAL collection (see above the coments)
    const reservationsOnDate = await RentalModel.find({
      $or: [
        {
          $and: [
            { daystart: { $gte: startDate } },
            { daystart: { $lte: endDate } },
          ],
        },
        {
          $and: [
            { dayend: { $gte: startDate } },
            { dayend: { $lte: endDate } },
          ],
        },
        {
          $and: [
            { daystart: { $lte: startDate } },
            { dayend: { $gte: endDate } },
          ],
        },
      ],
    });

    // Extract boats document with reservations on the specified date
    const boatsWithReservations = reservationsOnDate.map(
      (reservation) => reservation.documentBoat
    );

    // Find boats that are not in the list of reserved boats: search in Boat Model witch id is NOT in boatsWithReservations
    const freeBoatsOnPeriod = await BoatModel.find({
      _id: { $nin: boatsWithReservations },
    });

    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: `Free boats from ${req.params.start} to ${req.params.end}  successfully retrieved ✅`,
        data: freeBoatsOnPeriod,
      });
  } catch (error) {
    // Handle errors
    console.error(
      `Error retrieving all Free boats from ${req.params.start} to ${req.params.end}-------🦑`,
      error
    );
    res.status(500).json({
      success: false,
      message: `Error retrieving all Free boats from ${req.params.start} to ${req.params.end} ❌`,
      error,
    });
  }
};

// ----------------------------------------------------------------
// ---------------------------------GET ONE Boat------------------
// ----------------------------------------------------------------

//! ------------ get all reservation of ONE BOAT------------------------------------------------------get all reservation of ONE BOAT

export const getAllReservationsOneBoat = async (req, res) => {
  try {
    const { boatId } = req.params;

    // Check if the boat exists
    const boatExists = await BoatModel.exists({ _id: boatId });

    if (!boatExists) {
      return res.status(404).json({
        success: false,
        message: `Boat with ID ${boatId} not found ❌`,
      });
    }

    // Get reservations for the boat
    const reservations = await RentalModel.find({
      documentBoat: boatId,
    })
      .populate("documentBoat")
      .exec();

    // Send response to the frontend
    res.status(200).json({
      success: true,
      message: `Reservations of the boat Id = ${boatId} successfully retrieved ✅`,
      data: reservations,
    });
  } catch (error) {
    // Handle errors
    console.error(
      `Error retrieving Reservations of the boat Id = ${boatId} 🦑`,
      error
    );

    res.status(500).json({
      success: false,
      message: `Error retrieving Reservations of the boat Id = ${boatId} ❌`,
      error: error.message,
    });
  }
};

//! ------------ get availabity of ONE BOAT in one Period of time-----------------------get availabity of ONE BOAT in one Period of time

export const checkBoatAvailability = async (req, res) => {
  try {
    const { boatId, start, end } = req.params;
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Find all bookings for the boat with the specified ID and in the date range
    const overlappingReservations = await RentalModel.find({
      documentBoat: boatId,
      $or: [
        {
          $and: [
            { daystart: { $gte: startDate } },
            { daystart: { $lte: endDate } },
          ],
        },
        {
          $and: [
            { dayend: { $gte: startDate } },
            { dayend: { $lte: endDate } },
          ],
        },
        {
          $and: [
            { daystart: { $lte: startDate } },
            { dayend: { $gte: endDate } },
          ],
        },
      ],
    });

    // If there are overlapping bookings, the boat is booked in that date range.
    const isReserved = overlappingReservations.length > 0;

    const notReserved = isReserved ? "" : "not";
    const iconReserved = isReserved ? "❌" : "✅";

    // Send response to the frontend
    res.status(200).json({
      isReserved,
      message: `Boat Id = ${boatId} is ${notReserved} from ${req.params.start} to ${req.params.end} reserved ${iconReserved}`,
      success: true,
    });
  } catch (error) {
    // Handle errors
    console.error(
      `Error retrieving information of reservation of the boat Id = ${boatId} 🦑`,
      error
    );

    res.status(500).json({
      success: false,
      message: `Error retrieving information of reservation of the boat Id = ${boatId} ❌`,
      error: error.message,
    });
  }
};
