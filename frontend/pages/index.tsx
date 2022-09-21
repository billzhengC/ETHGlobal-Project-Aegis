import Layout from "@components/common/layout";
import type { NextPage } from "next";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return <div className="text-amber-800">Project Aegis is here</div>;
};

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Home;
