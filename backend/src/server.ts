import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { isTest } from "../env.js";
import morgan from "morgan";
import authRoute from "./routes/authRoute.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev", { skip: () => isTest() }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "server is still alive" });
});

app.use("/api/auth", authRoute);

export { app };
export default app;
