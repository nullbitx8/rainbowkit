/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable no-redeclare */
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { Chain } from '../components/RainbowKitProvider/RainbowKitChainContext';

type SerializedOptions = string;
const sharedConnectors = new Map<SerializedOptions, any>();

type WalletConnectVersion = '1' | '2';

type WalletConnectConnectorConfig = ConstructorParameters<
  typeof WalletConnectConnector
>[0];
export type WalletConnectConnectorOptions = Omit<
  // @ts-ignore - 'options' does not exist on type 'unknown'
  WalletConnectConnectorConfig['options'],
  'projectId'
>;

type WalletConnectLegacyConnectorConfig = ConstructorParameters<
  typeof WalletConnectLegacyConnector
>[0];
export type WalletConnectLegacyConnectorOptions =
  // @ts-ignore - 'options' does not exist on type 'unknown'
  WalletConnectLegacyConnectorConfig['options'];

function createConnector(
  version: '1',
  config: WalletConnectLegacyConnectorConfig
): WalletConnectLegacyConnector;

function createConnector(
  version: '2',
  config: WalletConnectConnectorConfig
): WalletConnectConnector;

function createConnector(
  version: WalletConnectVersion,
  config: WalletConnectLegacyConnectorConfig | WalletConnectConnectorConfig
): WalletConnectLegacyConnector | WalletConnectConnector {
  const connector =
    version === '1'
      ? new WalletConnectLegacyConnector(
          config as WalletConnectLegacyConnectorConfig
        )
      : new WalletConnectConnector(config as WalletConnectConnectorConfig);
  sharedConnectors.set(JSON.stringify(config), connector);
  return connector;
}

export function getWalletConnectConnector(config: {
  chains: Chain[];
  projectId?: string; // to prepare for migration to v2
  options?: WalletConnectLegacyConnectorOptions;
}): WalletConnectLegacyConnector;

export function getWalletConnectConnector(config: {
  version: '1';
  chains: Chain[];
  options?: WalletConnectLegacyConnectorOptions;
}): WalletConnectLegacyConnector;

export function getWalletConnectConnector(config: {
  version: '2';
  chains: Chain[];
  projectId?: string;
  options?: WalletConnectConnectorOptions;
}): WalletConnectConnector;

export function getWalletConnectConnector({
  chains,
  options = {},
  projectId,
  version = '1',
}: {
  chains: Chain[];
  projectId?: string;
  version?: WalletConnectVersion;
  options?: WalletConnectLegacyConnectorOptions | WalletConnectConnectorOptions;
}): WalletConnectLegacyConnector | WalletConnectConnector {
  return version === '2' && projectId
    ? _getWalletConnectConnector({
        chains,
        options: options as WalletConnectConnectorOptions,
        projectId,
      })
    : _getWalletConnectLegacyConnector({
        chains,
        options: options as WalletConnectLegacyConnectorOptions,
      });
}

function _getWalletConnectLegacyConnector({
  chains,
  options = {},
}: {
  chains: Chain[];
  options?: WalletConnectLegacyConnectorOptions;
}): WalletConnectLegacyConnector {
  const config = {
    chains,
    options: {
      qrcode: false,
      ...options,
    },
  };

  const serializedConfig = JSON.stringify(config);
  const sharedConnector = sharedConnectors.get(serializedConfig);

  return sharedConnector ?? createConnector('1', config);
}

function _getWalletConnectConnector({
  chains,
  options = {},
  projectId,
}: {
  chains: Chain[];
  projectId: string;
  options?: WalletConnectConnectorOptions;
}): WalletConnectConnector {
  const config = {
    chains,
    options: {
      projectId,
      showQrModal: false,
      ...options,
    },
  };

  const serializedConfig = JSON.stringify(config);
  const sharedConnector = sharedConnectors.get(serializedConfig);

  return sharedConnector ?? createConnector('2', config);
}
