import { connect, set } from "mongoose";

let connection: any = null;

export const initiateConnection = async (URI: string) => {
  // If connection is pooled, return the connection;
  if (connection) return connection;
  // Create a new connection
  try {
    set("strictQuery", false);
    connection = await connect(URI);
    console.log(`Connected MongoDB at: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(error);
    // process.exit(1); // TODO: check if terminating from here has a problem in the long run
    throw error;
  }
};

export const getConnection = () => {
  return connection;
};
