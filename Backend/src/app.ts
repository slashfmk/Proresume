import dotenv from "dotenv";
dotenv.config({ path: "config.env" });

const cors = require("cors");
import express from "express";
const bodyParser = require("body-parser");

const SERVER_ADD: string = "localhost";

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    method: ["POST", "PUT", "DELETE", "GET", "PATCH"],
    credentials: true,
  })
);

const skillRoute = require("./routes/skillRoute");
const experienceRoute = require("./routes/experienceRoute");
const educationRoute = require("./routes/educationRoute");
const resumeRoute = require("./routes/resumeRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

const base_url = `/api/v1`;

app.use(`${base_url}/skill/`, skillRoute);
app.use(`${base_url}/experience/`, experienceRoute);
app.use(`${base_url}/auth/`, authRoute);
app.use(`${base_url}/user/`, userRoute);
app.use(`${base_url}/resume/`, resumeRoute);
app.use(`${base_url}/education/`, educationRoute);

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return res.status(400).json(error);
  }
);

const port = 8000;

app.listen(port, SERVER_ADD, () => {
  console.log(`Server is running on port ${port}`);
});
