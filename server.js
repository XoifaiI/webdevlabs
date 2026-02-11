"use strict";

import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes.js";
import logger from "./utils/logger.js";
import { create } from "express-handlebars";
import { requestLogger } from "./middleware/request-logger.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://code.jquery.com",
          "https://cdnjs.cloudflare.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      },
    },
  }),
);
app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Request logging
app.use(requestLogger);

// Static files (absolute path)
app.use(express.static(path.join(__dirname, "public")));

// Templating
const handlebars = create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// Routes
app.use("/", routes);

// Error handling (must be after routes)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => logger.info(`Your app is listening on port ${port}`));
