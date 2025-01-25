const express = require("express");
const Amadeus = require("amadeus");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const { MongoClient } = require('mongodb');

const amadeus = new Amadeus({
  clientId: 'ZpWs6GEqzuHYlGRvJSsvImwWAIHRFe0I',
  clientSecret: 'CrcocCa2pgaGFzxl'
});

// MongoDB Local URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient to connect to the local MongoDB server
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function start() {
  try {
    await client.connect();
    console.log('Connected to local MongoDB');
    console.log('Starting server...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Start MongoDB connection
start();

// Endpoint for flight search
app.get("/api/flights", async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    children,
    carrierClass,
    tripType,
  } = req.query;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      departureDate: departureDate,
      adults: adults,
      children: children,
      travelClass: carrierClass,
      currencyCode: 'INR',
      tripType: tripType,
    });

    const flights = response.data;
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching flight offers." });
  }
});

// Endpoint to create a booking
app.post('/api/booking', async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingsCollection = client.db('bookings').collection('flights');
    const result = await bookingsCollection.insertOne(bookingData);

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to retrieve user bookings
app.get('/api/booking', async (req, res) => {
  const { username } = req.query;

  try {
    const bookingsCollection = client.db('bookings').collection('flights');
    const userBookings = await bookingsCollection.find({ username }).toArray();
    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server on port 8000
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
