import cors from "cors";
import express, { Application, json, urlencoded } from "express";
import errorHandler from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";

const app: Application = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.use(errorHandler);

export default app;
