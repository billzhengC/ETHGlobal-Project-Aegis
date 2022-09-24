import { NextApiResponse } from "next";
import { ApiRequest } from "@model/model";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import Joi from "joi";
import prisma from "@lib/common/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface ProfileGetReq {
  address: string;
  quest: number;
}

const paramsSchema = Joi.object({
  address: Joi.string().required(),
  quest: Joi.number().integer().min(1).required(),
});

const handler = async (
  req: ApiRequest<ProfileGetReq, null>,
  resp: NextApiResponse
) => {
  try {
    const walletPub = req.params.address.toLowerCase();
    const userSelected = await prisma.t_users.findUnique({
      where: { wallet_pub: walletPub },
    });

    const tasklogsItem = await prisma.a_task_logs.findFirst({
      where: {
        AND: {
          quest_id: req.params.quest,
          mid: userSelected.id,
        },
      },
    });

    resp.status(200).json({meta: tasklogsItem?.meta || ""});
  } catch (e) {
    if (resp.statusCode === 200) {
      logger.errorc(
        req,
        `mid: ${req.user.mid}, has unexpected error: ${e.stack}`
      );
      resp.statusCode = 500;
    }
    resp.json({ msg: "unexpected error" });
    return;
  }
};

export default verify(handler, { method: "get", paramsSchema });
