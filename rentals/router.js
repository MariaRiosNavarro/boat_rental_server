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
  getFreeBoatsOnDate,
  getRentedBoatsOnDate,
} from "./controller.js";

export const router = new express.Router();
const upload = multer({ dest: "./images" });

router.get("/", getAllRental);
router.get("/:id", getOneRental);
router.post("/:id", upload.none(), addOneRental);
router.put("/:id", upload.none(), editOneRental);
router.delete("/:id", removeOneRental);

//------------------------------------  BOATS + RENTALS combined ROUTES

router.get("/free-boats/all", getAllNotRentedBoats); // with only /free-boats I have a conflict with, router.get("/:id", getOneBoat);

// ----------------------------------- One Day

router.get("/free-boats/:date", getFreeBoatsOnDate);
router.get("/reserved-boats/:date", getRentedBoatsOnDate);

// ------------------------Time Period

router.get("/reserved-boats/:date/:end", getRentedBoatsOnPeriod);
router.get("/free-boats/:date/:end", getFreeBoatsOnPeriod);
