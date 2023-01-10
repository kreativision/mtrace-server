/*
 * This file is no longer used as is.
 * We're planning to not open the connection from within the app, but externally.
 */
import { connect, set } from "mongoose";
import { exit } from "process";
import { getEnv } from "../env/config";

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
