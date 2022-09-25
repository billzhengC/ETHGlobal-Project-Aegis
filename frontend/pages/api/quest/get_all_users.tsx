import { NextApiResponse } from "next";
import { ApiRequest } from "@model/model";
import verify from "@lib/api/middlewares/verify";
import Joi from "joi";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import { CommonError } from "@model/error";
import prisma from "@lib/common/prisma";
import { Alchemy, Network } from "alchemy-sdk";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface GetAllUsersResp {
  userList: userItem[];
}

export interface userItem {
  userID: number;
  address: string;
  ens: string;
  timeCompleted: any;
  isOwnRabbithole: boolean;
}
export interface GetAllUsersReq {
  quest: number;
}

const paramsSchema = Joi.object({
  quest: Joi.number().integer().min(1).required(),
});

const accessList = [
  "0xd81b2605ea329d7eae196f5a0e9f3411527902f7",
  "0xe08ee60d8fceabe51159ec11b0211e8242e9d53d",
];

const RABBITHOLE_ADDRESS_LIST = [
  "0xc9a42690912f6bd134dbc4e2493158b3d72cad21",
  "0x2face815247a997eaa29881c16f75fd83f4df65b",
  "0xa3b61c077da9da080d22a4ce24f9fd5f139634ca",
];

const config = {
  apiKey: process.env.ETH_MAINNET_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

const handler = async (
  req: ApiRequest<GetAllUsersReq, null>,
  resp: NextApiResponse<GetAllUsersResp>
) => {
  const walletPub = req.user?.wallet_pub.toLowerCase();

  // TODO: use dynamic access control
  if (!accessList.includes(walletPub))
    throw new CommonError(400, "Access denied");

  let userList: userItem[] = [];

  // Get all users by questID, put into list
  const allUsersInTaskLogs = await prisma.a_task_logs.findMany({
    where: {
      quest_id: req.params.quest,
    },
  });

  let idList = [];

  for (let i = 0; i < allUsersInTaskLogs.length; i++) {
    const u = allUsersInTaskLogs[i];
    if (idList.includes(u.mid)) continue;
    idList.push(u.mid);
    // userList.push({ userID: Number(u.mid), address: u.meta?.creator?.id, timeCompleted: "" });

    const userSelected = await prisma.t_users.findUnique({
      where: { id: u.mid },
    });

    userList.push({
      userID: Number(u.mid),
      address: userSelected.wallet_pub || "",
      timeCompleted: u.mtime,
      ens: "",
      isOwnRabbithole: false,
    });
  }

  for (let i = 0; i < userList.length; i++) {
    // Find ENS in db and add to each user
    const ensItem = await prisma.t_go_ens.findFirst({
      where: {
        wallet_pub: userList[i].address,
      },
    });
    userList[i].ens = ensItem?.ens || "";

    console.log(userList);

    // Check if user owns rabbithole
    const nfts = await alchemy.nft.getNftsForOwner(userList[i].address);

    for (let j = 0; j < nfts.ownedNfts.length; j++) {
      const item = nfts.ownedNfts[j];

      if (RABBITHOLE_ADDRESS_LIST.includes(item.contract.address)) {
        userList[i].isOwnRabbithole = true;
        break;
      }
    }
  }

  resp.status(200).json({ userList });
};

export default auth(verify(error(handler), { method: "post", paramsSchema }));
