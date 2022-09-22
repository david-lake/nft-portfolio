// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Solana, Metaplex
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const metadata = {
    "model": "metadata",
    "address": "7vPWtXZkZiEYm4NKpMgW7eJUZ1TRcqjxg79jb6W1tS2h",
    "mintAddress": "ApusBjwNZkoYtbzpgjNYRgkkQYG4Rx9iGiAD12Bf37Tt",
    "updateAuthorityAddress": "9AhZV9edy7LvLbAMnXWxuKv1j5sch6BzhbSXvHA84kcX",
    "json": null,
    "jsonLoaded": false,
    "name": "Skellers World #1349",
    "symbol": "GRRR",
    "uri": "https://arweave.net/kCJs_Bh6umaQDD5UCk19WX8Vw75wnUClip7aOephNHY",
    "isMutable": true,
    "primarySaleHappened": true,
    "sellerFeeBasisPoints": 1000,
    "editionNonce": 255,
    "creators": [
        {
            "address": "3Z7f2YopXD4EaKfvM758x3HAmHBDJEx337XvzC2RHWkL",
            "verified": true,
            "share": 0
        },
        {
            "address": "Abqf1Le5PAXjai5PM5TiPEaeoLviy1Br6TAAf3EBDsLr",
            "verified": false,
            "share": 25
        },
        {
            "address": "7rMKpF2FSFQysJ2BfLJnsBXqmbEoqG2FR5qDwBZVZaBH",
            "verified": false,
            "share": 25
        },
        {
            "address": "JBHoivwwRKhpTNatpf4f3wLpyYHgnFdEwHGWn2EpdeFq",
            "verified": false,
            "share": 50
        }
    ],
    "tokenStandard": null,
    "collection": null,
    "collectionDetails": null,
    "uses": null
}

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const connection = new Connection("https://devnet.genesysgo.net/", "confirmed");
  const metaplex = new Metaplex(connection)
  metaplex.use(walletAdapterIdentity(wallet));

  const [nft, setNft] = useState(null);

  const getAllNFTs = async () => {
    const task = await metaplex.nfts().findAllByOwner(wallet.publicKey);
    task.onSuccess(() => console.log(task.getResult()));
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
    if (nft === null) {
      return (
        <div>
          <p>Loading ...</p>
        </div>
      )
    } else {
      return (
        <div>
          <p>{nft.collection.name}</p>
        </div>
      )
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      convertToJson()
    }
  }, [wallet.publicKey, convertToJson]);

  return (

    <div className="md:hero mx-auto p-4">
      <div className="text-center">
        {!wallet.publicKey && renderNotConnectedContainer()}
        {wallet.publicKey && renderConnectedContainer()}
      </div>
    </div>
  );
};
