import multer from "multer";
import express from "express";
import {
  addOneBoat,
  getAllBoats,
  getOneBoat,
  removeOneBoat,
  editOneBoat,
  getAllNotRentedBoats,
  getFreeBoatsOnDate,
} from "./controller.js";

export const router = new express.Router();
const upload = multer({ dest: "./images" });

router.get("/", getAllBoats);
router.get("/:id", getOneBoat);
router.post("/", upload.single("img"), addOneBoat);
router.put("/:id", upload.single("img"), editOneBoat);
router.delete("/:id", removeOneBoat);

//routes for free boots & no rental today

router.get("/free-boats", getAllNotRentedBoats);
router.get("/free-boats/:date", getFreeBoatsOnDate);
