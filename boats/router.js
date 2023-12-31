import express from "express";
import {
  addOneBoat,
  getAllBoats,
  getOneBoat,
  removeOneBoat,
  editOneBoat,
} from "./controller.js";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const router = new express.Router();

router.get("/", getAllBoats);
router.get("/:id", getOneBoat);
router.post("/", upload.single("img"), addOneBoat);
router.put("/:id", upload.single("img"), editOneBoat);
router.delete("/:id", removeOneBoat);
