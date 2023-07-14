import express from "express";
import "dotenv/config";
import cloudinary from "./utils/cloudinary.js";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening to port: ${PORT}`);
});

//Upload image to cloudinary
app.post("/upload", async (req, res) => {
  try {
    const file = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: "Test",
    });
    console.log(uploadResponse);
    res.json({ message: "uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

//Get images from cloudinary
app.get("/images", async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:Test")
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();
    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Error retrieving images", error });
  }
});

//Delete image
app.delete("/images", async (req, res) => {
  const { image } = req.body;
  try {
    await cloudinary.uploader.destroy(image);
    // Respond with a success message
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.json({ message: "Error deleting image" });
  }
});
