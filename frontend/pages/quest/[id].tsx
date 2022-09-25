import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import Image from "next/image";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useCommonContext } from "@contexts/commonContextProvider";
import useABC from "@lib/common/abc";
import { MintBadgeResp } from "pages/api/quest/mintBadge";
import { CompletionStatusResp } from "pages/api/quest/completion_status";

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
  }
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
  const { call } = useABC();
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    if (!user || !questID) return;
    const checkTaskCompletion = async () => {
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
    };
    checkTaskCompletion();
  }, [questID, user]);

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
  };

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
          </dl>
        </div>
      </div>
    </div>
  );
}

QuestID.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
