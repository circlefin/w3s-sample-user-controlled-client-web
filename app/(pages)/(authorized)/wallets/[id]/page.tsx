import { WalletDetails } from "@/app/containers/WalletDetails";

type WalletDetailsParams = {
  params: {
    /*
     * Wallet id.
     */
    id: string;
  };
};

export default function WalletDetailsPage({ params }: WalletDetailsParams) {
  return <WalletDetails id={params.id} />;
}
