// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Solana
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import pkg from '../../../package.json';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return (

    <div className="md:hero mx-auto p-4">
      <div className="text-center">
        {wallet.publicKey && <p>Connected</p>}
      </div>
    </div>
  );
};
