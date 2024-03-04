import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import { Resend } from 'resend';
import InfoEmail from '../src/components/Email/InfoEmail.tsx';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Middleware to parse JSON bodies

let formData = null;

app.post("/api/email", (req, res) => {
  console.log("Received form data:", req.body);
  formData = req.body;
  const sendEmail = async (data) => {
    console.log(data.email);
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'lucastembras@ufl.edu',
        subject: 'On the Pulse',
        react: InfoEmail(data)
    });
  }
  sendEmail(formData);
  res.json({message: 'Form data received successfully', formData})
});

app.get("/api/email", (req,res) => {
    res.json(formData);
});

app.listen(5172, () => {
  console.log("Server started on Port 5172");
});