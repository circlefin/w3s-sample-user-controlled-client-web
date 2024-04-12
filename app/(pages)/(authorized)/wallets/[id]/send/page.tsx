import { SelectToken } from "@/app/containers/Wallets/Send";

interface WalletSendProps {
  params: {
    /*
     * Wallet id.
     */
    id: string;
  };
}

export default function WalletSendPage({ params }: WalletSendProps) {
  return <SelectToken walletId={params.id} />;
}
