"use client";

import { useRouter } from "next/navigation";

import QRCode from "react-qr-code";

import { useWallet } from "@/app/axios";
import { Content, BackButton, CopyButton } from "@/app/components";
import { Typography } from "@mui/joy";

interface DepositProps {
  walletId: string;
}

export const Deposit: React.FC<DepositProps> = ({ walletId }) => {
  const router = useRouter();

  const { data: wallet } = useWallet(walletId);
  const walletAddress = wallet?.data.wallet.address ?? "";

  return (
    <Content>
      <nav>
        <BackButton onClick={router.back}>Deposit</BackButton>
      </nav>
      <div className="flex flex-col items-center justify-center mx-auto self-stretch gap-8 w-full">
        <Typography>
          Use the QR code or wallet address to deposit directly to this wallet.
        </Typography>
        <QRCode value={walletAddress} />
        <CopyButton
          variant="solid"
          copyValue={walletAddress}
          copyLabel={walletAddress}
        />
      </div>
    </Content>
  );
};
