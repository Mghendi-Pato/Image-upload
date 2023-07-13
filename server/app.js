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
