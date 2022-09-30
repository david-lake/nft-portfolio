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
  const [collections, setCollections] = useState([]);

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
      {nfts &&
        collections.map((collection, index) => (
          <div key={index} className="collection">
            <h1>{collection}</h1>
            {nfts.map((nft, index) => (
              nft.json.name.includes(collection) && (
                <div key={index} className="nft-preview">
                  <h2>{nft.json.name}</h2>
                  <img
                    src={nft.json.image}
                    alt={"Image of " + nft.json.name}
                  />
                </div>
              )
            ))}
          </div>
        ))
      }
    </div>
  );

  useEffect(() => {
    if (wallet.publicKey) {
      getNfts();
      if (nfts) {
        const allCollections = []
        nfts.map((nft) => {
          allCollections.push(nft.json.name.split(" #")[0]);
        });
        setCollections([...new Set(allCollections)]);
      }
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
