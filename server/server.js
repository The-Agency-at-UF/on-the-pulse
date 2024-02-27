import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Middleware to parse JSON bodies

let formData = null;

app.post("/api/email", (req, res) => {
  console.log("Received form data:", req.body);
  formData = req.body;

  res.json({message: 'Form data received successfully', formData})
});

app.get("/api/email", (req,res) => {
    res.json(formData);
});

app.listen(5172, () => {
  console.log("Server started on Port 5172");
});