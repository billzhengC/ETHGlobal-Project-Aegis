import { Client } from "@xmtp/xmtp-js";
import { ethers, utils } from "ethers";
import { schedule } from "node-cron";
import {
  SUBSCRIPTION_CONTRACT,
  SUBSCRIPTION_CONTRACT_ABI,
} from "../constant/abi";
import {
  CACHE_KEY_TASK_LOG_SKIP,
  POLYGON_MUMBAI_RPC_URL,
} from "../constant/constant";
import { getCache, setCache } from "../lib/common/cache";
import prisma from "../lib/common/prisma";
import NP from "number-precision";

const DB_PAGE_SIZE = 1000;
const wallet = new ethers.Wallet(
  process.env.NOTIFICATION_SENDER_PRIVATE_KEY as any
);

let xmtpClient: Client;
const sendNotification = schedule("*/15 * * * * *", async () => {
  try {
    const start = Date.now();
    console.log("[sendNotification] start:", start);

    const provider = new ethers.providers.JsonRpcProvider(
      POLYGON_MUMBAI_RPC_URL
    );
    const contract = new ethers.Contract(
      SUBSCRIPTION_CONTRACT,
      SUBSCRIPTION_CONTRACT_ABI,
      provider
    );

    const taskLogSkipStr = await getCache(CACHE_KEY_TASK_LOG_SKIP);
    let taskLogSkip = taskLogSkipStr === "" ? 0 : parseInt(taskLogSkipStr);

    let taskLogList = await prisma.a_task_logs.findMany({
      select: { id: true, t_user: true, meta: true },
      skip: taskLogSkip,
      take: DB_PAGE_SIZE,
    });
    let msgSentCount = 0;
    while (taskLogList.length > 0) {
      for (const taskLog of taskLogList) {
        if (!taskLog.t_user) {
          continue;
        }
        const isSubscribed = await contract.check(
          wallet.address,
          taskLog.t_user.wallet_pub
        );
        if (isSubscribed) {
          console.log(
            "[sendNotification] sending to:",
            taskLog.t_user.wallet_pub
          );
          const meta = JSON.parse(taskLog.meta);
          const projectName = meta["token"]["name"];
          const amount = NP.divide(meta["amount"], 1000000000000000000);
          const msg = {
            from: "0xe08ee60d8fceabe51159ec11b0211e8242e9d53d",
            title: `Hi ${taskLog.t_user.uname}! You just won the Carbon Retirement Challenge`,
            content: `You have successfully retired ${amount} NCT in the project ${projectName}, you can claim your Badge now!`,
          };
          console.log(JSON.stringify(msg));
          try {
            const message = await xmtpClient.sendMessage(
              utils.getAddress(taskLog.t_user.wallet_pub),
              JSON.stringify(msg)
            );
            console.log(
              `[sendNotification] notification sent to:${
                taskLog.t_user.wallet_pub
              }, raw message: ${JSON.stringify(message)}`
            );
            msgSentCount++;
          } catch (err: any) {
            console.error(
              `[sendNotification] send notification error: ${err.message}, taskLogId: ${taskLog.id}`
            );
          }
        }
      }
      taskLogSkip += taskLogList.length;
      await setCache(CACHE_KEY_TASK_LOG_SKIP, taskLogSkip.toString());
      taskLogList = await prisma.a_task_logs.findMany({
        select: { id: true, t_user: true, meta: true },
        skip: taskLogSkip,
        take: DB_PAGE_SIZE,
      });
    }

    console.log(
      `[sendNotification] done, cost:${
        Date.now() - start
      }, message send count: ${msgSentCount}`
    );
  } catch (error) {
    console.trace(error);
  }
});

export const initJobs = async () => {
  xmtpClient = await Client.create(wallet);
  sendNotification.start();
};

export const stopJobs = () => {
  sendNotification.stop();
};
