import { MINT_BADGE_ABI } from "@constants/abi";
import {
  MUMBAI_BADGE_MINT_CONTRACT,
  POLYGON_MUMBAI_RPC_URL,
} from "@constants/constants";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import verify from "@lib/api/middlewares/verify";
import { getTasklogsAndCheckStatus } from "@lib/api/quest/questUtil";
import logger from "@lib/common/logger";
import prisma from "@lib/common/prisma";
import { CommonError } from "@model/error";
import { ApiRequest } from "@model/model";
import { ethers } from "ethers";
import Joi from "joi";
import { NextApiResponse } from "next";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface MintBadgeResp {
  hash: string;
}

export interface MintBadgeReq {
  quest: number;
}

const abi = MINT_BADGE_ABI;

const paramsSchema = Joi.object({
  quest: Joi.number().integer().min(1).required(),
});
const handler = async (
  req: ApiRequest<MintBadgeReq, null>,
  resp: NextApiResponse<MintBadgeResp>
) => {
  // Can mint? Already minted?
  const { isCompleted, isClaimed } = await getTasklogsAndCheckStatus(
    req.user.wallet_pub.toLowerCase(),
    req.params.quest
  );
  if (!isCompleted) {
    throw new CommonError(400, "You are not eligible");
  }
  if (isClaimed) {
    throw new CommonError(400, "You have already minted");
  }

  // Now actual minting
  const provider = new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL);
  const signer = new ethers.Wallet(
    process.env.NFT_SIGNER_PRIVATE_KEY,
    provider
  );

  // Compute message hash
  const messageHash = ethers.utils.id(
    `${req.user.wallet_pub}:${req.params.quest}`
    // `${req.user.wallet_pub}:${4}`
  );

  // Sign the message hash
  let messageBytes = ethers.utils.arrayify(messageHash);
  const signature = await signer.signMessage(messageBytes);

  const contract = new ethers.Contract(MUMBAI_BADGE_MINT_CONTRACT, abi, signer);
  try {
    const res = await contract.mint(
      req.user.wallet_pub,
      messageHash,
      signature
    );

    // Write mint status to db
    const metaMsg = { quest1: "minted" };

    try {
      await prisma.t_users.update({
        where: {
          wallet_pub: req.user.wallet_pub,
        },
        data: {
          meta: JSON.stringify(metaMsg),
        },
      });
    } catch (err) {
      logger.errorc(req, `Saving status to db error: ${err}, tx: ${res.hash}`);
    }

    resp.status(200).json({ hash: res.hash });
  } catch (err) {
    if (err?.error?.reason?.startsWith("execution reverted: 0x")) {
      throw new CommonError(
        400,
        "This NFT has already been minted: ${err?.error?.reason}"
      );
    }
    logger.errorc(req, `Error calling contract: ${err?.error}`);
    throw new CommonError(
      500,
      "Unexpected error happend when minting your NFTs"
    );
  }
};

export default auth(verify(error(handler), { method: "post", paramsSchema }));
