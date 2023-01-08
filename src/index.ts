import connectDatabase from "@config/db";
import { getEnv } from "@env/config";
import errorHandler from "@middlewares/error.middleware";
import userRoutes from "@routes/user.routes";
import cors from "cors";
import express, { Application, json, urlencoded } from "express";

const app: Application = express();
const { PORT, NODE_ENV } = getEnv();

connectDatabase();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.use(errorHandler);

app.listen(PORT, (): void => {
  if (NODE_ENV === "development")
    console.info(`Dev server started at: http://localhost:${PORT}`);
  else console.info(`Server started on port: ${PORT}`);
});
