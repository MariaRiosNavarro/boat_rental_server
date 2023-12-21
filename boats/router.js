import multer from "multer";
import express from "express";
import {
  addOneBoat,
  getAllBoats,
  getOneBoat,
  removeOneBoat,
  editOneBoat,
  getFreeBoatsOnDate,
  getAllNotRentedBoats,
  getAllRentedBoats,
  getRentedBoatsOnDate,
  getFreeBoatsOnPeriod,
  getRentedBoatsOnPeriod,
} from "./controller.js";

export const router = new express.Router();
const upload = multer({ dest: "./images" });

router.get("/", getAllBoats);
router.get("/:id", getOneBoat);
router.post("/", upload.single("img"), addOneBoat);
router.put("/:id", upload.single("img"), editOneBoat);
router.delete("/:id", removeOneBoat);

//------------------------------------  BOATS + RENTALS combined ROUTES

router.get("/free-boats/all", getAllNotRentedBoats); // with only /free-boats I have a conflict with, router.get("/:id", getOneBoat);
router.get("/reserved-boats/all", getAllRentedBoats);

// ----------------------------------- One Day

router.get("/free-boats/:date", getFreeBoatsOnDate);
router.get("/reserved-boats/:date", getRentedBoatsOnDate);

// ------------------------Time Period

router.get("/free-boats/:date/:end", getFreeBoatsOnPeriod);
router.get("/reserved-boats/:date/:end", getRentedBoatsOnPeriod);
