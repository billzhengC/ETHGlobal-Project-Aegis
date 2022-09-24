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

const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "channel",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "SubscriptionStatus",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_channel",
        type: "address",
      },
      {
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "change",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_channel",
        type: "address",
      },
      {
        internalType: "address",
        name: "_subscriber",
        type: "address",
      },
    ],
    name: "check",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "recoverSigner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "signatureUsed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "subscriptionTracker",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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

  const contract = new ethers.Contract(SUBSCRIPTION_CONTRACT, abi, provider);
  const contractResp = await contract.check(
    req.params.channel.toLowerCase(),
    req.user.wallet_pub
  );
  resp.json({ status: contractResp });
};

export default auth(verify(error(handler), { method: "get", paramsSchema }));
