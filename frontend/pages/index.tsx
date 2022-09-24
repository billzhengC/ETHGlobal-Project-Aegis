import Layout from "@components/common/layout";
import QuestDisplay from "@components/quest/questDisplay";
import { POLYGON_MUMBAI_RPC_URL } from "@constants/constants";
import { useLoading } from "@contexts/loadingProvider";
import useABC from "@lib/common/abc";
import { ethers } from "ethers";
import Link from "next/link";

import { ReactElement, useRef, useState } from "react";
import { NotificationChangeResp } from "./api/notification/change";
import { NotificationCheckResp } from "./api/notification/check";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const { call } = useABC();
  const { setLoading } = useLoading();
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>();
  const [subscriptionTX, setSubscriptionTX] = useState<string>("");
  const timerRef = useRef<NodeJS.Timer>();
  return (
    <div>
      <div className="flex flex-col">
        <button
          onClick={async () => {
            const resp = await call<NotificationCheckResp>({
              method: "get",
              path: "/notification/check",
              params: {
                channel: "0xE08ee60D8fCEABE51159eC11B0211E8242E9D53D",
              },
            });
            setSubscriptionStatus(resp.status);
          }}
        >
          Check Subscription Status {`${subscriptionStatus}`}
        </button>
        <button
          onClick={async () => {
            if (typeof subscriptionStatus === "undefined") {
              return;
            }
            setLoading({
              visible: true,
              message: subscriptionStatus
                ? "Unsubscribing..."
                : "Subscribing...",
            });
            const resp = await call<NotificationChangeResp>({
              method: "post",
              path: "/notification/change",
              data: {
                channel: "0xE08ee60D8fCEABE51159eC11B0211E8242E9D53D",
                status: !subscriptionStatus,
              },
            });
            setSubscriptionTX(resp.hash);
            setLoading({
              visible: true,
              message: "Checking subscription status...",
            });
            const provider = new ethers.providers.JsonRpcProvider(
              POLYGON_MUMBAI_RPC_URL
            );
            timerRef.current = setInterval(async () => {
              const receipt = await provider.getTransactionReceipt(resp.hash);
              if (receipt && receipt.blockNumber) {
                clearInterval(timerRef.current);
                setLoading({
                  visible: false,
                  message: "Checking subscription status...",
                });
                setSubscriptionStatus(!subscriptionStatus);
              }
            }, 2000);
          }}
        >
          {typeof subscriptionStatus === "undefined"
            ? "Check Subscription Status First"
            : subscriptionStatus
            ? "Unsubscribe"
            : "Subscribe"}{" "}
        </button>
        <div className="text-center">
          {subscriptionTX !== "" && (
            <a
              href={`https://mumbai.polygonscan.com/tx/${subscriptionTX}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {`hash: ${subscriptionTX}`}
            </a>
          )}
        </div>
      </div>

      <QuestDisplay />
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Home;
