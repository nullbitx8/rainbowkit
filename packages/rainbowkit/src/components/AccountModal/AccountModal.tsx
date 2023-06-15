import React from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useCoinbaseBnsName } from '../../hooks/useCoinbaseBnsName';
import { useMainnetEnsAvatar } from '../../hooks/useMainnetEnsAvatar';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { ProfileDetails } from '../ProfileDetails/ProfileDetails';

export interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountModal({ onClose, open }: AccountModalProps) {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const ensName = useMainnetEnsName(address);
  const bnsName = useCoinbaseBnsName(address);
  const ensAvatar = useMainnetEnsAvatar(ensName);
  const { disconnect } = useDisconnect();

  if (!address) {
    return null;
  }

  const titleId = 'rk_account_modal_title';

  return (
    <>
      {address && (
        <Dialog onClose={onClose} open={open} titleId={titleId}>
          <DialogContent bottomSheetOnMobile padding="0">
            <ProfileDetails
              address={address}
              balanceData={balanceData}
              ensAvatar={ensAvatar}
              ensName={bnsName}
              onClose={onClose}
              onDisconnect={disconnect}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
