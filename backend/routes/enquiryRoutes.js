import express from "express";
import { sendEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

router.post("/send-enquiry", sendEnquiry);

export default router;