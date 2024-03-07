/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import admin from "firebase-admin";
import * as bodyParser from "body-parser"
import * as express from "express";
import * as cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));

let formData:any = null;

app.post("/api/email", (req, res) => {
    console.log("Received form data:", req.body);
    formData = req.body;
    res.json({message: 'Form data received successfully', formData})
});

app.get("/api/email", (req,res) => {
    res.json(formData);
});

export const testEmailThing = onRequest(app);
