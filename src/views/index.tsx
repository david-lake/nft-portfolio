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

  const [nft, setNft] = useState();

  const getAllNFTs = async () => {
    const task = await metaplex.nfts().findAllByOwner(wallet.publicKey);
    task.onSuccess(() => setNft(task.getResult()));
    task.run();
  };

  const convertToJson = async () => {
    fetch(metadata.uri)
    .then((response) => response.json())
    .then((json) => setNft(json))
  };

  const renderNotConnectedContainer = () => (
    <div>
      <p>Not connected</p>
    </div>
  );

  const renderConnectedContainer = () => {
    if (!nft) {
      return (
        <div>
          <p>Loading ...</p>
        </div>
      )
    } else {
      if (nft.length > 0) {
        return (
          <div>
            <p>Found nfts</p>
          </div>
        )
      } else {
        return (
          <div>
            <p>You have no nfts</p>
          </div>
        )
      }
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      getAllNFTs()
      console.log(nft)
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
