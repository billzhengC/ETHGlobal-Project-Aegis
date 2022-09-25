import prisma from "@lib/common/prisma";

export const getTasklogsAndCheckStatus = async (walletPub: string, questID: number) => {
  const userSelected = await prisma.t_users.findUnique({
    where: { wallet_pub: walletPub },
  });

  const tasklogsItem = await prisma.a_task_logs.findFirst({
    where: {
      AND: {
        quest_id: questID,
        mid: userSelected.id,
      },
    },
  });

  const isCompleted = tasklogsItem?.meta?.length > 0;
  const isClaimed = userSelected.meta?.length > 0;
  return {tasklogsItem, isCompleted, isClaimed};
};
