import { schedule } from "node-cron";
import { CACHE_KEY_TASK_LOG_SKIP } from "../constants/constants";
import { getCache } from "../lib/common/cache";
import prisma from "../lib/common/prisma";

const DB_PAGE_SIZE = 1000;

const initJobs = () => {
  const sendNotification = schedule("*/5 * * * * *", async () => {
    try {
      const start = Date.now();
      console.log("[sendNotification] start:", start);

      const taskLogSkipStr = await getCache(CACHE_KEY_TASK_LOG_SKIP);
      let taskLogSkip = taskLogSkipStr === "" ? 0 : parseInt(taskLogSkipStr);
      await prisma.a_task_logs.findMany({
        skip: taskLogSkip,
        take: DB_PAGE_SIZE,
      });
      console.log(taskLogSkip);
      console.log("[sendNotification] done, cost:", Date.now() - start);
    } catch (error) {
      console.trace(error);
    }
  });
  sendNotification.start();
};

export default initJobs;
