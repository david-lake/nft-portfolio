// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Solana, Metaplex
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  const metaplex = new Metaplex(connection)
  metaplex.use(walletAdapterIdentity(wallet));

  const [nft, setNft] = useState(null);

  const getNft = async () => {
    let myNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey }).run();
    myNfts.filter((x) => x.primarySaleHappened === true);
    if(!myNfts.length) {
     setNft(null);
     return;
    }
    let randIdx = Math.floor(Math.random() * myNfts.length);
    const nft = await metaplex.nfts().load({ metadata: myNfts[randIdx] }).run();
    setNft(nft);
  };

  const renderNotConnectedContainer = () => (
    <div>
      <p>Not connected</p>
    </div>
  );

  const renderConnectedContainer = () => (
    <div>
      {nft && (
        <div>
          <h1>{nft.json.name}</h1>
          <img
            src={nft.json.image}
            alt="Image of nft"
          />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (wallet.publicKey) {
      getNft()
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
