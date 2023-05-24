/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Chain } from '../../../components/RainbowKitProvider/RainbowKitChainContext';
import { isIOS } from '../../../utils/isMobile';
import { Wallet } from '../../Wallet';
import { getWalletConnectConnector } from '../../getWalletConnectConnector';
import type {
  WalletConnectConnectorOptions,
  WalletConnectLegacyConnectorOptions,
} from '../../getWalletConnectConnector';
import { listenForUri } from '../../listenForUri';

export interface WalletConnectWalletOptions {
  projectId?: string;
  chains: Chain[];
  options?:
    | WalletConnectLegacyConnectorOptions
    | Omit<WalletConnectConnectorOptions, 'projectId'>;
}

export const walletConnectWallet = ({
  chains,
  options,
  projectId,
}: WalletConnectWalletOptions): Wallet => ({
  id: 'walletConnect',
  name: 'WalletConnect',
  iconUrl: async () => (await import('./walletConnectWallet.svg')).default,
  iconBackground: '#3b99fc',
  createConnector: () => {
    const ios = isIOS();

    const connector = getWalletConnectConnector({
      version: '2',
      chains,
      projectId,
      options: {
        showQrModal: ios,
        ...options,
      },
    });

    const getUri = () => listenForUri(connector);

    return {
      connector,
      ...(ios
        ? {}
        : {
            mobile: { getUri },
            qrCode: { getUri },
          }),
    };
  },
});
