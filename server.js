import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
  });
});

app.listen(PORT, () => {
  console.log(`*** server doin a sprint over at port: ${PORT} ***`);
});
