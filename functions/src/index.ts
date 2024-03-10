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
import * as bodyParser from "body-parser";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));

let formData: any = null;
const post: any = {
  to: [],
  message: {
    subject: "",
    html: "",

  },

};
app.post("/api/email", async (req, res) => {
  console.log("Received form data:", req.body);
  formData = req.body;
  res.json({message: "Form data received successfully", formData});
  post.to = "lucastembras@ufl.edu";

  post.message.subject="Learn More Inquiry from On the Pulse Website";
  // html message
  post.message.html = "<p> Hello, I'm ";
  // first name, last name, company, with space
  post.message.html+=(formData.firstName + " " + formData.lastName +
  " from " + formData.company + "</p>");
  // list off the checked boxes
  for (let i = 1; i <= formData.inquiry.length; i++) {
    post.message.html+="<p>" + i + "). " + formData.inquiry[0] + "</p>";
  }

  // insert other if present
  post.message.html+=("<p> Other: " + formData.other + "</p>");

  // include email
  post.message.html+=("<p> If you'd like, you can reach me at " +
  formData.email + "</p>");

  // closing line
  post.message.html+="<p> Best,</p>" + "<p>" +
  formData.firstName + " " + formData.lastName + "</p>";

  const firebaseApp= admin.initializeApp();
  console.log("Initialized the on-the-pulse web app!", firebaseApp);
  const firestore = admin.firestore();
  const docRef = await firestore.collection("mail").add(post);
  console.log("Added document with ID:", docRef.id);
});

app.get("/api/email", async (req, res) => {
  res.json(formData);
});

export const testEmailThing = onRequest(app);
