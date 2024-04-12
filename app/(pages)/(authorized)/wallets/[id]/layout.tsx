"use client";
import { CopyButton } from "@/app/components";
import { blockchainMeta, getAddressAbbreviation } from "@/app/shared/utils";
import { IconButton, Tooltip } from "@mui/joy";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { signOut } from "next-auth/react";
import { useWallet } from "@/app/axios";
import Image from "next/image";

type WalletLayoutParams = {
  /*
   * Wallet id.
   */
  id: string;
};

export default function WalletLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: WalletLayoutParams;
}) {
  const { data: wallet } = useWallet(params.id);
  const walletAddress = wallet?.data.wallet.address ?? "";
  const blockchainInfo = blockchainMeta(wallet?.data.wallet.blockchain);

  return (
    <>
      {/* Wallet Address */}
      <div className="flex p-5 justify-between items-center relative gap-x-4">
        <Tooltip title={blockchainInfo.testnet} placement="bottom-start">
          <IconButton>
            <Image
              alt="blockchain"
              src={blockchainInfo.svg}
              width={20}
              height={20}
            />
          </IconButton>
        </Tooltip>

        <CopyButton
          copyValue={walletAddress}
          copyLabel={getAddressAbbreviation(walletAddress)}
        />

        <Tooltip title="Sign Out" placement="bottom-end" className="">
          <IconButton
            size="sm"
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: "/signin",
              })
            }
          >
            <ArrowRightStartOnRectangleIcon
              width={24}
              className="text-blue-600"
            />
          </IconButton>
        </Tooltip>
      </div>
      {children}
    </>
  );
}
