import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { initJobs, stopJobs } from "./jobs/jobs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

initJobs();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

process.once("SIGUSR2", function () {
  stopJobs();
  server.close();
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  stopJobs();
  server.close();
  process.kill(process.pid, "SIGINT");
});
