import { schedule } from "node-cron";
import { CACHE_KEY_TASK_LOG_SKIP } from "../constants/constants";
import { getCache } from "../lib/common/cache";

const initJobs = () => {
  const sendNotification = schedule("*/5 * * * * *", async () => {
    const d = await getCache(CACHE_KEY_TASK_LOG_SKIP);

    console.log(d);
    console.log("sendNotification running:", Date.now());
  });
  sendNotification.start();
};

export default initJobs;
