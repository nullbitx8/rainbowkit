import type { Connector } from 'wagmi/connectors';

export async function listenForUri(connector: Connector): Promise<string> {
  const provider = await connector.getProvider();
  return new Promise<string>(resolve => provider.once('display_uri', resolve));
}
