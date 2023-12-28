import express from "express";
import multer from "multer";
import {
  addOneRental,
  getAllRental,
  getOneRental,
  removeOneRental,
  editOneRental,
  // determinate search
  getRentedBoatsOnPeriod,
  getFreeBoatsOnPeriod,
  getAllNotRentedBoats,
  getAllReservationsOneBoat,
  checkBoatAvailability,
  getAllRentalsFromADate,
  getCurrentAndFutureReservationsOneBoat,
} from "./controller.js";

export const router = new express.Router();
const upload = multer({ dest: "./images" });

router.get("/", getAllRental);
router.get("/date/:date", getAllRentalsFromADate);
router.get("/:id", getOneRental);
router.post("/:id", upload.none(), addOneRental);
router.put("/:id", upload.none(), editOneRental);
router.delete("/:id", removeOneRental);

//------------------------------------  BOATS + RENTALS combined ROUTES

router.get("/free-boats/all", getAllNotRentedBoats); // with only /free-boats I have a conflict with, router.get("/:id", getOneBoat);

// ------------------------Time Period

router.get("/reserved-boats/:start/:end", getRentedBoatsOnPeriod);
router.get("/free-boats/:start/:end", getFreeBoatsOnPeriod);

//-------------------------One Boat
router.get("/reservations-one-boat/:boatId", getAllReservationsOneBoat);
router.get(
  "/current-reservations/:boatId",
  getCurrentAndFutureReservationsOneBoat
);

router.get("/reservation-one-boat/:boatId/:start/:end", checkBoatAvailability);
