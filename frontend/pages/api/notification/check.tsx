import { SUBSCRIPTION_ABI } from "@constants/abi";
import {
  POLYGON_MUMBAI_RPC_URL,
  SUBSCRIPTION_CONTRACT,
} from "@constants/constants";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import verify from "@lib/api/middlewares/verify";
import { ApiRequest } from "@model/model";
import { ethers } from "ethers";
import Joi from "joi";
import { NextApiResponse } from "next";

export interface NotificationCheckReq {
  channel: string;
}

const paramsSchema = Joi.object<NotificationCheckReq>({
  channel: Joi.string().required(),
});

export interface NotificationCheckResp {
  status: boolean;
}

const handler = async (
  req: ApiRequest<NotificationCheckReq, null>,
  resp: NextApiResponse
) => {
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL);

  const contract = new ethers.Contract(
    SUBSCRIPTION_CONTRACT,
    SUBSCRIPTION_ABI,
    provider
  );
  const contractResp = await contract.check(
    req.params.channel.toLowerCase(),
    req.user.wallet_pub
  );
  resp.json({ status: contractResp });
};

export default auth(verify(error(handler), { method: "get", paramsSchema }));
