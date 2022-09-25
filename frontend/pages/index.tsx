import Layout from "@components/common/layout";
import QuestDisplay from "@components/quest/questDisplay";

import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <QuestDisplay />
    </div>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Home;
