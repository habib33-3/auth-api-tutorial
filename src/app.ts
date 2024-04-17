import "dotenv/config";
import express, { json } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";

const app = express();

app.use(json());

app.use(router);

const port = config.get("port");

app.listen(port, () => {
  log.info(`app started at ${port}`);

  connectToDb();
});
