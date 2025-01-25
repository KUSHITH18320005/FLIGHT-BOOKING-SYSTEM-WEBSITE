const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("./review.js"); // Corrected path

// Route handlers go here

module.exports = router;
