import { BoatModel } from "./model.js";
import { v2 as cloudinary } from "cloudinary";

const cloud_url = process.env.CLOUDINARY_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// --------------handle Images-----------cloudinary functions

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "image",
  });
  return res;
}

// check -> dont really work for now
async function handleDelete(file) {
  const res = await cloudinary.uploader.destroy(file, {
    resource_type: "image",
  });
  return res;
}

// --------------------------------------------------------------------GET ALL

export const getAllBoats = async (req, res) => {
  try {
    //Wait & recibe Data
    const boats = await BoatModel.find();
    res
      .status(200)
      //Confirmation back & data to frontend
      .json({
        success: true,
        message: "Boats successfully retrieved ✅",
        data: boats,
      });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all boats -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving all boats ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------GET ONE

export const getOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    //Wait & recibe Data
    const boat = await BoatModel.findOne({ _id: id });
    // No Response handling

    if (!boat) {
      return res.status(404).json({ message: "Boat not found" });
    }
    //Confirmation back  & data to frontend
    res.status(200).json({
      success: true,
      message: `Boat with id= ${id} sucessfully retrieved ✅`,
      data: boat,
    });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving all boats -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving one boat ❌",
      error,
    });
  }
};

// --------------------------------------------------------------------ADD ONE

export const addOneBoat = async (req, res) => {
  try {
    const boat = new BoatModel(req.body);

    let array = boat.material;
    let firstElement = array[0];
    let materialsArray = JSON.parse(firstElement);
    boat.material = materialsArray;
    // cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      console.log(cldRes.secure_url);
      boat.img = cldRes.secure_url;
    }

    // Save the new Boot in db
    await boat.save();

    //Confirmation back

    res
      .status(201)
      .json({
        success: true,
        message: "Boat successfully added ✅",
        data: boat, //new
      })
      .end();

    // Error Handling
  } catch (error) {
    // Handle errors
    console.error("Error adding one boat -------🦑", error);
    res.status(500).json({
      success: false,
      message: "Error adding one boat ❌",
      error: error.message, //new
    });
  }
};

// --------------------------------------------------------------------DELETE ONE

export const removeOneBoat = async (req, res) => {
  try {
    const { id } = req.params;
    // Save Boat to remove later the img
    const boat = await BoatModel.findOne({ _id: id });
    let image = boat.img;
    // delete image -  check in the future - dont work for now
    if (image) await handleDelete(image);
    // Remove the Boot
    await BoatModel.findOneAndDelete({ _id: id });

    //sucess true
    res.status(200).json({
      success: true,
      message: `Boat with id= ${id} successfully deleted ✅`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error removing one boat❌", error });
  }
};

// --------------------------------------------------------------------EDIT ONE

export const editOneBoat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "BOAT ID is missing" });
    }

    //save new data & add image if it is in the request
    const newBoatData = { ...req.body };

    // cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // check if old Data has a Image
      const oldData = await BoatModel.findById(id);
      const oldImage = oldData.img;

      // remove the old image if the req has a new image
      // error handling no oldimage need it

      if (req.file && oldImage) {
        await handleDelete(oldImage);
      } else {
        console.log("Image don´t change");
      }

      const cldRes = await handleUpload(dataURI);
      console.log(cldRes.secure_url);
      newBoatData.img = cldRes.secure_url;
    }

    // Update Data

    const updateBoat = await BoatModel.findByIdAndUpdate(id, newBoatData, {
      new: true,
    });

    //  Confirmation back
    res.status(201).json({
      success: true,
      message: `Boat with id= ${id} successfully updated ✅`,
      data: newBoatData,
    });
  } catch (error) {
    // Handle errors
    console.error("Error editing one boat -------🦑", error);
    res
      .status(500)
      .json({ success: false, message: "Error editing one boat ❌", error });
  }
};
