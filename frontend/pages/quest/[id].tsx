import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import { Image } from "@mantine/core";

import { ReactElement, useMemo } from "react";

const exampleData = {
  title: "NCT Retirement Competition",
  description: "Retire NCT now and get exclusive NFTs",
  host: "Toucan",
  start_time: "",
  end_time: "",
  contract: "",
  eligibility: "Retire at least 1 NCT",
};

export default function QuestID() {
  const router = useRouter();
  const questID = useMemo(() => {
    if (router.isReady) {
      return router.query.id;
    }
  }, [router.isReady, router.query.id]);

  return (
    <div className="py-10 px-10">
      <div className="text-lg">{exampleData.title}</div>
      <div>{exampleData.description}</div>
      <Image
        src="https://images.unsplash.com/photo-1586980088852-088b1cd6c8eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        height={300}
        alt="Carbon retirement"
      />
      <div>Eligibility: {exampleData.eligibility}</div>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Claim NFT
      </button>
    </div>
  );
}

QuestID.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
