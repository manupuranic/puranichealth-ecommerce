import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";

config();

import connectDB from "./utils/database.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

connectDB()
  .then(() => {
    app.listen(3002, () => {
      console.log("Server Listening on port: 3002");
    });
  })
  .catch((err) => {
    console.log(err);
  });
