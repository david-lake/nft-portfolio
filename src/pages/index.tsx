import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>NFT Portfolio</title>
        <meta
          name="description"
          content="NFT-Portfolio"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
