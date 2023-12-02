import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
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

// CSRF-CSRF Setup

// CSRF quand POST & GET
// Vérification token CSRF d'abord, token de session après
// Token CSRF doit être lié à la session actuelle (généré par le serveur en fonction de la session)
// Records of token (Refresh Token)


// CORS authorization, JSON data formatting for API communication
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
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
// App routers
// ==========

app.use("/", routes);

// ==========
// App start
// ==========

try {
  await mongoose.connect(`${MONGO_STRING}${MONGO_DB_NAME}`);
  console.log(`✅ Connecté à la base MongoDB ${MONGO_DB_NAME}`);
  app.listen(APP_PORT, () => {
    console.log(`API started on http://${APP_HOSTNAME}:${APP_PORT}`);
  });
} catch (err) {
  console.error("Erreur de connexion", err.message);
}
