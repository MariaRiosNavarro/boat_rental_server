import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { router as boatsRouter } from "./boats/router.js";
import { router as rentalsRouter } from "./rentals/router.js";

// mongodb Atlas
await mongoose.connect(process.env.MONGODB_URI);
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
// const corsOptions = {
//   origin: process.env.FRONTEND_URL,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

app.use(express.json());
// app.use("/images", express.static("./images"));

app.use("/api/boats", boatsRouter);
app.use("/api/rentals", rentalsRouter);

app.listen(process.env.PORT, () =>
  console.log("Port is: http://localhost:" + process.env.PORT)
);
