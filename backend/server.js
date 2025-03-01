import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json()). This method is used to parse the incoming Request Object as a JSON Object.

app.use(cors()); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

app.use(helmet()); // helmet is a security middleware that helps you protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

app.use(morgan("dev")); // morgan is a middleware that logs HTTP requests. It's very useful for debugging and monitoring.    

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
