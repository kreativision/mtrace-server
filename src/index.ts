import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import cors from "cors";
import { getEnv } from "./env/config";

const app: Application = express();
const { PORT, NODE_ENV } = getEnv();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, (): void => {
  if (NODE_ENV === "development")
    console.info(`Dev server started at: http://localhost:${PORT}`);
  else console.info(`Server started on port: ${PORT}`);
});
