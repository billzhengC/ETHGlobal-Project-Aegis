import Layout from "@components/common/layout";
import type { NextPage } from "next";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Message: NextPageWithLayout = () => {
  return <div className="text-amber-800">Message</div>;
};

Message.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Message;
