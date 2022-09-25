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

export interface NotificationChangeReq {
  channel: string;
  status: boolean;
}

const dataSchema = Joi.object<NotificationChangeReq>({
  channel: Joi.string().required(),
  status: Joi.boolean().required(),
});

export interface NotificationChangeResp {
  hash: string;
}

const handler = async (
  req: ApiRequest<null, NotificationChangeReq>,
  resp: NextApiResponse<NotificationChangeResp>
) => {
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL);

  const signer = new ethers.Wallet(
    process.env.SUBSCRIPTION_CONTRACT_PRIVATE_KEY,
    provider
  );

  // Compute message hash
  const messageHash = ethers.utils.id(
    `${req.data.channel.toLowerCase()}:${req.user.wallet_pub.toLowerCase()}:${
      req.data.status
    }:${Date.now()}`
  );

  // Sign the message hash
  let messageBytes = ethers.utils.arrayify(messageHash);
  const signature = await signer.signMessage(messageBytes);

  const contract = new ethers.Contract(
    SUBSCRIPTION_CONTRACT,
    SUBSCRIPTION_ABI,
    signer
  );
  const contractResp = await contract.change(
    req.data.channel.toLowerCase(),
    req.user.wallet_pub.toLowerCase(),
    req.data.status,
    messageHash,
    signature
  );
  resp.json({ hash: contractResp.hash });
};

export default auth(verify(error(handler), { method: "post", dataSchema }));
