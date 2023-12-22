import { RentalModel } from "./model.js";
import { BoatModel } from "../boats/model.js";

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

    if (rentalInfo && rentalInfo.dayend) {
      rentalInfo.dayend = new Date(rentalInfo.dayend);
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
    const rentals = await RentalModel.find().populate("documentBoat").exec();
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

    if (newRentalData && newRentalData.dayend) {
      newRentalData.dayend = new Date(newRentalData.dayend);
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

//------------------------------------------------------------------------------BOATS + RENTALS combined ROUTES

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
    console.log("allreser------------", allReservations);

    // Extract boats with reservations
    const boatsWithReservations = allReservations.map(
      (reservation) => reservation.documentBoat
    );
    console.log("boatsWithReservations------------", boatsWithReservations);

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

export const getRentedBoatsOnDate = async (req, res) => {
  try {
    const requestedDate = new Date(req.params.date);
    // Calculate the next date to create a range for reservations- ONLY ONE DAY RENTAL
    const nextDate = new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000);

    // Filter reservations on the specified one date for ONE DAY range in RENTAL collection
    const reservationsOnDate = await RentalModel.find({
      daystart: { $gte: requestedDate, $lt: nextDate },
    });
    // Extract boats document with reservations on the specified date
    const boatsWithReservations = reservationsOnDate
      .map((reservation) => reservation.documentBoat)
      .populate("documentBoat")
      .exec();

    res.json(boatsWithReservations);
  } catch (error) {
    console.error(
      `Error retrieving rented boats on the specified date:${requestedDate} -------🦑`,
      error
    );
    res.status(500).send("Internal server error");
  }
};

export const getRentedBoatsOnPeriod = async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const endDate = new Date(req.params.end);

    console.log("startdate----------------------", startDate);
    console.log("endDate----------------------", endDate);

    // Filter reservations that overlap with the specified date range in RENTAL collection
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
    })
      .populate("documentBoat")
      .exec();

    console.log("reservationsOnDate----------------------", reservationsOnDate);
    res.json(reservationsOnDate);
  } catch (error) {
    console.error(
      `Error retrieving free boats on the specified date:${requestedDate} -------🦑`,
      error
    );
    res.status(500).send("Internal server error");
  }
};

// With othe time

export const getFreeBoatsOnPeriod = async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const endDate = new Date(req.params.end);

    console.log("startdate----------------------", startDate);
    console.log("endDate----------------------", endDate);

    // Filter reservations that overlap with the specified date range in RENTAL collection
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

    console.log("reservationsOnDate----------------------", reservationsOnDate);

    // Extract boats document with reservations on the specified date
    const boatsWithReservations = reservationsOnDate.map(
      (reservation) => reservation.documentBoat
    );

    // Find boats that are not in the list of reserved boats: search in Boat Model witch id is NOT in boatsWithReservations
    const freeBoatsOnPeriod = await BoatModel.find({
      _id: { $nin: boatsWithReservations },
    });

    res.json(freeBoatsOnPeriod);
  } catch (error) {
    console.error(
      `Error retrieving free boats on the specified date:${requestedDate} -------🦑`,
      error
    );
    res.status(500).send("Internal server error");
  }
};

export const getAllReservationsOneBoat = async (req, res) => {
  try {
    const { boatId } = req.params;

    const reservations = await RentalModel.find({
      documentBoat: boatId,
    })
      .populate("documentBoat")
      .exec();

    res.json(reservations);
  } catch (error) {
    console.error(
      "Error getting all reservations for one boat -------🦑",
      error
    );
    res.status(500).send("Internal server error");
  }
};

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

    res.json({ isReserved });
  } catch (error) {
    console.error("Error checking boat availability -------🦑", error);
    res.status(500).send("Internal server error");
  }
};
