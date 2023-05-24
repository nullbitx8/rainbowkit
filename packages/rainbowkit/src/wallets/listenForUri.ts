import type { Connector } from 'wagmi/connectors';

/*
export function listenForUri(connector: Connector): () => Promise<string> {
  return async () => {
    const provider = await connector.getProvider();
    const displayUri = new Promise<string>(resolve =>
      provider.once('display_uri', resolve)
    );
    return await displayUri;
  };
}
*/

export async function listenForUri(connector: Connector): Promise<string> {
  const provider = await connector.getProvider();
  const displayUri = new Promise<string>(resolve =>
    provider.once('display_uri', resolve)
  );
  return await displayUri;
}
