import { NextApiResponse } from "next";
import { ApiRequest } from "@model/model";
import verify from "@lib/api/middlewares/verify";
import Joi from "joi";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import { getTasklogsAndCheckStatus } from "@lib/api/quest/questUtil";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface CompletionStatusResp {
  meta: string;
  isCompleted: boolean;
  isClaimed: boolean;
}
export interface CompletionStatusReq {
  quest: number;
}

const paramsSchema = Joi.object({
  quest: Joi.number().integer().min(1).required(),
});

const handler = async (
  req: ApiRequest<CompletionStatusReq, null>,
  resp: NextApiResponse<CompletionStatusResp>
) => {
  const walletPub = req.user?.wallet_pub.toLowerCase();

  const { tasklogsItem, isCompleted, isClaimed } =
    await getTasklogsAndCheckStatus(walletPub, req.params.quest);

  resp.status(200).json({
    meta: tasklogsItem?.meta || "",
    isCompleted: isCompleted,
    isClaimed: isClaimed,
  });
};

export default auth(verify(error(handler), { method: "get", paramsSchema }));
