import { SendToken } from "@/app/containers/Wallets/Send";

interface WalletSendTokenProps {
  params: {
    /*
     * Wallet id.
     */
    id: string;
    /*
     * Token name.
     */
    tokenName: string;
  };
}

export default function WalletSendTokenPage({ params }: WalletSendTokenProps) {
  return (
    <SendToken
      walletId={params.id}
      tokenName={decodeURIComponent(params.tokenName)}
    />
  );
}
