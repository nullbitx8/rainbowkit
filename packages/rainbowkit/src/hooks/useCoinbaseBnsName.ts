import { useEffect, useState } from 'react';

export function useCoinbaseBnsName(address: string | undefined | null) {
  const [bnsName, setBnsName] = useState(null);

  const fetchBnsName = async () => {
    const resp = await fetch(
      `https://testnet-api.basename.app/v1/web3-names/${address}`
    );
    const data = await resp.json();
    const bnsName = data[0]?.bns;
    setBnsName(bnsName);
  };

  // fetch BNS name on mount
  useEffect(() => {
    fetchBnsName();
  }, [fetchBnsName]);

  return bnsName;
}
