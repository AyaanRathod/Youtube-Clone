import express from "express";
import Ffmpeg from "fluent-ffmpeg";

const app = express();


app.post("/proccess-video", (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if(!inputFilePath || !outputFilePath) {
        return res.status(400).send("Bad Request: Missing input or output file path");
    }

    Ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale =-1:360") //360p
        .on("end",() => {// when processing is completed the "end" event
            res.status(200).send("Processing finished succesfully"); 
        })
        .on("error",(err) =>{// In case of error log console error message
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`); // Common error is very large video file
        })
        .save(outputFilePath);

    
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
