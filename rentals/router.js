import express from "express";
import multer from "multer";
import {
  addOneRental,
  getAllRental,
  getOneRental,
  removeOneRental,
  editOneRental,
} from "./controller.js";

export const router = new express.Router();
const upload = multer({ dest: "./images" });

router.get("/", getAllRental);
router.get("/:id", getOneRental);
router.post("/:id", upload.none(), addOneRental);
router.put("/:id", upload.none(), editOneRental);
router.delete("/:id", removeOneRental);
