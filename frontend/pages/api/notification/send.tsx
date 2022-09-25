import { SUBSCRIPTION_ABI } from "@constants/abi";
import {
  POLYGON_MUMBAI_RPC_URL,
  SUBSCRIPTION_CONTRACT,
} from "@constants/constants";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import verify from "@lib/api/middlewares/verify";
import { ApiRequest } from "@model/model";
import { Client, Message } from "@xmtp/xmtp-js";
import { ethers, utils } from "ethers";
import Joi from "joi";
import { NextApiResponse } from "next";

export interface NotificationSendReq {
  address_list: Array<string>;
  title: string;
  content: string;
}

const dataSchema = Joi.object<NotificationSendReq>({
  address_list: Joi.array().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export interface NotificationSendResp {
  msg: string;
}

const handler = async (
  req: ApiRequest<null, NotificationSendReq>,
  resp: NextApiResponse<NotificationSendResp>
) => {
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL);

  const contract = new ethers.Contract(
    SUBSCRIPTION_CONTRACT,
    SUBSCRIPTION_ABI,
    provider
  );
  const contractResp = await contract.checkMulti(
    "0xe08ee60d8fceabe51159ec11b0211e8242e9d53d",
    req.data.address_list
  );
  const toSendAddressList = new Array<string>();
  for (let i = 0; i < req.data.address_list.length; i++) {
    if (contractResp[i]) {
      toSendAddressList.push(utils.getAddress(req.data.address_list[i]));
    }
  }

  const wallet = new ethers.Wallet(
    process.env.SUBSCRIPTION_CONTRACT_PRIVATE_KEY
  );
  const xmtpClient = await Client.create(wallet);

  const sendList = new Array<Promise<Message>>();
  for (const peerAddress of toSendAddressList) {
    sendList.push(
      xmtpClient.sendMessage(
        peerAddress,
        JSON.stringify({
          from: req.user.wallet_pub,
          title: req.data.title,
          content: req.data.content,
        })
      )
    );
  }
  await Promise.all(sendList);
  resp.json({ msg: "ok" });
};

export default auth(verify(error(handler), { method: "post", dataSchema }));
