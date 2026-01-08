import express from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.use((req, res) => {
  res.status(422).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
