import express from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middleware/error.middleware";

import cloudAuthRouter from "./routes/cloudAuth.routes";
import cloudUserRouter from "./routes/cloudUser.routes";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/cloud/auth", cloudAuthRouter);
app.use("/api/cloud/user", cloudUserRouter);


app.use((req, res) => {
  res.status(422).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
