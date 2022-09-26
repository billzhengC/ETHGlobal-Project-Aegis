import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import Image from "next/image";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCommonContext } from "@contexts/commonContextProvider";
import useABC from "@lib/common/abc";
import { MintBadgeResp } from "pages/api/quest/mintBadge";
import { CompletionStatusResp } from "pages/api/quest/completion_status";
import { POLYGON_MUMBAI_RPC_URL } from "@constants/constants";
import { NotificationCheckResp } from "pages/api/notification/check";
import { useLoading } from "@contexts/loadingProvider";
import { NotificationChangeResp } from "pages/api/notification/change";
import { ethers } from "ethers";
import { Transition, Dialog } from "@headlessui/react";
import { CheckIcon } from "@mantine/core";
import { Client } from "@xmtp/xmtp-js";

const exampleData = [
  {
    title: "Carbon Retirement Competition 🔥",
    description: `Let's challenge each other on how much we can offset our carbon footprint. Retire Nature Carbon Tonne (NCT) now and get exclusive NFTs.`,
    space: "Toucan Protocol",
    start_time: DateTime.utc(2022, 9, 24),
    end_time: DateTime.utc(2022, 10, 1),
    contract: "",
    eligibility: (
      <div>
        Retire at least 1 ton of carbon at{" "}
        <a
          href="https://toucan.earth"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          toucan.earth
        </a>
      </div>
    ),
    instructions: (
      <div>
        1. Buy NCT on SushiSwap <br />
        2. Go to{" "}
        <a
          href="https://toucan.earth"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          toucan.earth
        </a>
        , launch the app and retire to offset <br />* This is still a testnet
        operation, so you can get NCT on Mumbai{" "}
        <a
          href="https://tco-2-faucet-ui.vercel.app/"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          here
        </a>
      </div>
    ),

    imageUrl: "/images/quest1.jpg",
  },
  {
    title: "Next-level Carbon Retirement Competition 🔥🔥",
    description: `Retire Carbon for 6 weeks straight and get exclusive NFTs.`,
    space: "Toucan Protocol",
    start_time: DateTime.utc(2022, 9, 24),
    end_time: DateTime.utc(2023, 1, 1),
    contract: "",
    eligibility: (
      <div>
        Retire at least 1 ton of carbon EVERY WEEK by the end of 2022 at{" "}
        <a
          href="https://toucan.earth"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          toucan.earth
        </a>
      </div>
    ),
    instructions: (
      <div>
        1. Buy NCT on SushiSwap <br />
        2. Go to{" "}
        <a
          href="https://toucan.earth"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          toucan.earth
        </a>
        , launch the app and retire to offset <br />* This is still a testnet
        operation, so you can get NCT on Mumbai{" "}
        <a
          href="https://tco-2-faucet-ui.vercel.app/"
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          here
        </a>
      </div>
    ),

    imageUrl: "/images/quest2.jpg",
  },
];

export default function QuestID() {
  const router = useRouter();
  const questID = parseInt(
    useMemo(() => {
      if (router.isReady) {
        return router.query.id;
      }
    }, [router.isReady, router.query.id]) as string
  );

  const { user } = useCommonContext();
  const { signer, call } = useABC();
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const { setLoading } = useLoading();
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>();
  const [subscriptionTX, setSubscriptionTX] = useState<string>("");
  const [sendStatus, setSendStatus] = useState<string>("");
  const timerRef = useRef<NodeJS.Timer>();

  const checkTaskCompletion = useCallback(async () => {
    const resp = await call<CompletionStatusResp>({
      method: "get",
      path: "/quest/completion_status",
      params: {
        quest: questID.toString(),
      },
    });

    setIsTaskCompleted(resp?.isCompleted);
    setIsClaimed(resp?.isClaimed);

    console.log(resp);
  }, [call, questID]);

  useEffect(() => {
    if (!user || !questID) return;

    checkTaskCompletion();
  }, [checkTaskCompletion, questID, user]);

  const subscribe = useCallback(async () => {
    setLoading({
      visible: true,
      message: "Subscribing...",
    });

    const resp = await call<NotificationChangeResp>({
      method: "post",
      path: "/notification/change",
      data: {
        channel: "0xE08ee60D8fCEABE51159eC11B0211E8242E9D53D",
        status: true,
      },
    });
    setSubscriptionTX(resp.hash);
    setLoading({
      visible: true,
      message: "Checking subscription status...",
    });
    // Create keypair on XMTP
    await Client.create(signer);
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
        setSubscriptionStatus(true);
      }
    }, 2000);
  }, [call, setLoading, signer]);

  const toggleSubscribe = async () => {
    if (typeof subscriptionStatus === "undefined") {
      return;
    }

    setLoading({
      visible: true,
      message: subscriptionStatus ? "Unsubscribing..." : "Subscribing...",
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
  };

  // useEffect(() => {
  //   checkStatus();
  // }, []);
  const checkStatus = async () => {
    const resp1 = await call<NotificationCheckResp>({
      method: "get",
      path: "/notification/check",
      params: {
        channel: "0xE08ee60D8fCEABE51159eC11B0211E8242E9D53D",
      },
    });
    setSubscriptionStatus(resp1?.status);
  };

  const claimNFT = async () => {
    const resp = await call<MintBadgeResp>({
      method: "post",
      path: "/quest/mintBadge",
      params: {
        quest: questID.toString(),
      },
    });

    if (resp?.hash) {
      alert(`Mint success. Tx is ${resp?.hash}`);
    }
    checkTaskCompletion();
    setOpenSubscribeButton(true);
  };

  const [openSubscribeButton, setOpenSubscribeButton] = useState(false);

  const cancelButtonRef = useRef(null);
  return (
    <div className="max-w-7xl mx-auto py-10 px-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="h-60 relative">
          <Image
            src={exampleData[questID - 1]?.imageUrl}
            priority
            alt="Carbon retirement"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {exampleData[questID - 1]?.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {exampleData[questID - 1]?.description}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Start time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {exampleData[questID - 1]?.start_time.toLocaleString(
                  DateTime.DATETIME_FULL
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">End time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {exampleData[questID - 1]?.end_time.toLocaleString(
                  DateTime.DATETIME_FULL
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Space</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {exampleData[questID - 1]?.space}
              </dd>
            </div>
            {/* <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900"></dd>
            </div> */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Eligibility</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {exampleData[questID - 1]?.eligibility}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Instructions
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {exampleData[questID - 1]?.instructions}
              </dd>
            </div>

            {isTaskCompleted ? (
              isClaimed ? (
                <button
                  type="button"
                  className="sm:col-span-2 disabled selection:inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-200 opacity-50 bg-gray-500 cursor-not-allowed"
                >
                  You have already claimed
                </button>
              ) : (
                <button
                  type="button"
                  className="sm:col-span-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  onClick={claimNFT}
                >
                  Claim your NFT
                </button>
              )
            ) : (
              <button
                type="button"
                className="sm:col-span-2 disabled selection:inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-200 opacity-50 bg-gray-500 cursor-not-allowed"
              >
                You are not eligible
              </button>
            )}

            {subscriptionStatus && (
              <div>
                <div className="text-base font-light">
                  Manage your message subscription:
                  <div className="text-sm font-normal">
                    <button onClick={toggleSubscribe}>
                      {typeof subscriptionStatus === "undefined"
                        ? ""
                        : subscriptionStatus
                        ? "Unsubscribe"
                        : "Subscribe"}{" "}
                    </button>
                  </div>
                  <div className="text-wrap">
                    {subscriptionTX !== "" && (
                      <a
                        href={`https://mumbai.polygonscan.com/tx/${subscriptionTX}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`hash: ${subscriptionTX.trim()}`}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </dl>
        </div>
      </div>

      <Transition.Root show={openSubscribeButton} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpenSubscribeButton}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Do you want to subscribe and get updated?
                    </Dialog.Title>
                    <div className=" mt-2">
                      <p className="text-left text-sm text-gray-500">
                        You will receive follow up communitye benefits and
                        become the first to know our upcoming quests.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      setOpenSubscribeButton(false);
                      subscribe();
                    }}
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setOpenSubscribeButton(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

QuestID.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
