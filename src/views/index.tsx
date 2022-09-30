// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Solana, Metaplex
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "confirmed");
  const metaplex = new Metaplex(connection)
  metaplex.use(walletAdapterIdentity(wallet));

  const [nfts, setNfts] = useState(null);

  const getNfts = async () => {
    let nfts = await metaplex.nfts().findAllByOwner({
      owner: wallet.publicKey
    }).run();
    nfts = nfts.filter((nft) => nft.primarySaleHappened === true);
    if(!nfts.length) {
     setNfts(null);
     return;
    }
    const promises = nfts.map((nft) => metaplex.nfts().load({ metadata: nft }).run());
    Promise.all(promises).then((values) => { setNfts(values) });
  };

  const renderNotConnectedContainer = () => (
    <div>
      <p>Not connected</p>
    </div>
  );

  const renderConnectedContainer = () => (
    <div>
      {nfts && nfts.map((nft, index) => (
        <div className="nft-preview">
          <h1>{nft.json.name}</h1>
          <img
            src={nft.json.image}
            alt={"Image of nft " + nft.json.name}
          />
        </div>
        ))
       }
    </div>
  );

  useEffect(() => {
    if (wallet.publicKey) {
      getNfts()
      console.log(nfts)
    }
  }, [wallet.publicKey]);

  return (

    <div className="md:hero mx-auto p-4">
      <div className="text-center">
        {!wallet.publicKey && renderNotConnectedContainer()}
        {wallet.publicKey && renderConnectedContainer()}
      </div>
    </div>
  );
};
