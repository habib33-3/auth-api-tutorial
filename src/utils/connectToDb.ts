import config from "config";
import { connect } from "mongoose";
import log from "./logger";

const connectToDb = async () => {
  const dbUri = config.get<string>("dbUri");

  try {
    await connect(dbUri);
    log.info("connected to db ");
  } catch (error) {
    console.log("error during connect db", error);

    process.exit(1);
  }
};

export default connectToDb;
