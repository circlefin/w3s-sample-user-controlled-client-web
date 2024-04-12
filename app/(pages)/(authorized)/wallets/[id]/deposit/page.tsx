import { Deposit } from "@/app/containers/Deposit";

type DepositParams = {
  params: {
    /*
     * Wallet id.
     */
    id: string;
  };
};

export default function DepositPage({ params }: DepositParams) {
  return <Deposit walletId={params.id} />;
}
