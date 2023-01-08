import { getEnv } from "@env/config";
import { connect, set } from "mongoose";
import { exit } from "process";

export default async function connectDatabase() {
  const { DB_URI, NODE_ENV } = getEnv();
  try {
    set("strictQuery", false);
    const connection = await connect(DB_URI ?? "");
    if (NODE_ENV === "development")
      console.log(`Mongo DB Connected: ${connection.connection.host}`);
  } catch (error) {
    if (NODE_ENV === "development") console.log(error);
    exit(1);
  }
}
