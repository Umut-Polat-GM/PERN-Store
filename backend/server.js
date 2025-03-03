import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/product.Routes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json()). This method is used to parse the incoming Request Object as a JSON Object.

app.use(cors()); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

app.use(helmet()); // helmet is a security middleware that helps you protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

app.use(morgan("dev")); // morgan is a middleware that logs HTTP requests. It's very useful for debugging and monitoring.

// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
      const decision = await aj.protect(req, {
        requested: 1, // specifies that each request consumes 1 token
      });
  
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          res.status(429).json({ error: "Too Many Requests" });
        } else if (decision.reason.isBot()) {
          res.status(403).json({ error: "Bot access denied" });
        } else {
          res.status(403).json({ error: "Forbidden" });
        }
        return;
      }
  
      // check for spoofed bots
      if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
        res.status(403).json({ error: "Spoofed bot detected" });
        return;
      }
  
      next();
    } catch (error) {
      console.log("Arcjet error", error);
      next(error);
    }
  });

app.use("/api/products", productRoutes);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("Database initialized successfully");
    } catch (error) {
        console.log("Error connecting to database: ", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
});
