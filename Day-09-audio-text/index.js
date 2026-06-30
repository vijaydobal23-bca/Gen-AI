import express from "express";
import { upload } from "./middleware/upload.middleware.js";
import { transcribeAudio } from "./services/ai.services.js";

const app = express();

app.get("/",(req ,res)=>{
  res.send(`<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="audio">
    <button type="submit">Upload</button>
  </form>`)
});

app.post("/upload", upload.single("audio"), async(req, res) => {
    const buffer = req.file.buffer;
    const transcription = await transcribeAudio(buffer);
    res.send(transcription);
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
}); 