import { WalletActivityDetails } from "@/app/containers/WalletActivityDetails";

type WalletActivityDetailsParams = {
  params: {
    /*
     * Wallet id.
     */
    id: string;
    /*
     * Transaction id.
     */
    transactionId: string;
  };
};

export default function WalletActivityDetailsPage({
  params,
}: WalletActivityDetailsParams) {
  return (
    <WalletActivityDetails
      walletId={params.id}
      transactionId={params.transactionId}
    />
  );
}
