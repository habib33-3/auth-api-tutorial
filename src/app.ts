import "dotenv/config";
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes"

const app = express();

app.use(router)

const port = config.get("port");

app.listen(port, () => {
  log.info(`app started at ${port}`);

  connectToDb();
});
