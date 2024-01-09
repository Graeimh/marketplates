import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import routes from "./routes/mainRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// ==========
// App initialization
// ==========

// Setting up for .env file
dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV, MONGO_STRING, MONGO_DB_NAME } =
  process.env;

// Directory name/pathing aid
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Starting the API
const app = express();

// CORS authorization, JSON data formatting for API communication
app.use(cors({ credentials: true, origin: "https://marketplates.netlify.app" })); //http://localhost:5173 
app.use(cookieParser());
app.use(express.json());

// Correctly indents code
app.locals.pretty = NODE_ENV !== "production";

// ==========
// App middlewares
// ==========

// Gets data from POST methods in html forms
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ==========
// App router
// ==========

app.use("/", routes);

// ==========
// App start
// ==========

try {
  await mongoose.connect(`${MONGO_STRING}`);
  //Confirm in the terminal that the database is connected
  console.log(`✅ Connecté à la base MongoDB ${MONGO_DB_NAME}`);
  app.listen(APP_PORT, () => {
    //Confirm in the terminal that the back end is ready to be called upon
    console.log(`API started on http://${APP_HOSTNAME}:${APP_PORT}`);
  });
} catch (err) {
  console.error("Erreur de connexion", err.message);
}