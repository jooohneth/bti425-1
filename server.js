import "dotenv/config";
import express from "express";
import cors from "cors";

import ListingsDB from "./modules/listingsDB.js";

const HTTP_PORT = process.env.PORT || 3000;
const app = express();
const db = new ListingsDB();

try {
  await db.initialize(process.env.MONGODB_CONN_STRING);
  app.listen(HTTP_PORT, () => {
    console.log(`*** server doin a sprint over at port: ${HTTP_PORT} ***`);
  });
} catch (err) {
  console.log(err);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
  });
});

app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({
      error: `500: ${err}`,
    });
  }
});

app.get("/api/listings", async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(+page, +perPage, name);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({
      error: `500: ${err}`,
    });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await db.getListingById(id);

    if (!listing) {
      res.status(404).json({ message: `Listing #${id} not found` });
      return;
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: `500: ${err}` });
  }
});

app.put("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.updateListingById(req.body, req.params.id);

    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    res.status(200).json({ message: "Listing updated successfully" });
  } catch (err) {
    res.status(500).json({ error: `500: ${err}` });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: `500: ${err}` });
  }
});
