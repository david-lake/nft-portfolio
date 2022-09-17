// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Solana, Metaplex
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const connection = new Connection("https://devnet.genesysgo.net/", "confirmed");
  const [allNFTs, setAllNFTs] = useState("");

  const metaplex = new Metaplex(connection)
  metaplex.use(walletAdapterIdentity(wallet));

  const getAllNFTs = async () => {
    const task = await metaplex.nfts().findAllByOwner(wallet.publicKey);
    task.onStatusChange((status: TaskStatus) => console.log(status));
    task.run();
  }

  useEffect(() => {
    if (wallet.publicKey) {
      getAllNFTs()
    }
  }, [wallet.publicKey, getAllNFTs])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="text-center">
        {wallet.publicKey && <p>Connected</p>}
      </div>
    </div>
  );
};
