"use client";

import { useCreateWallet, useWallets } from "@/app/axios";
import { BackButton, Content, useW3sContext } from "@/app/components";
import { BlockchainEnum, blockchainNames } from "@/app/shared/types";
import { blockchainMeta } from "@/app/shared/utils";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Button, Radio, RadioGroup, Sheet, Typography } from "@mui/joy";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateWalletPage() {
  const walletsQuery = useWallets();
  const createWalletMutation = useCreateWallet();
  const router = useRouter();
  const { client } = useW3sContext();

  const [selected, setSelected] = useState<BlockchainEnum>();
  const [loading, setLoading] = useState(false);

  const createLoading = createWalletMutation.isLoading || loading;

  return (
    <Content>
      <nav className='pt-4'>
        <BackButton onClick={() => router.push("/wallets")}>
          <Typography level='title-md'>Create Wallet</Typography>
        </BackButton>
      </nav>
      Select a chain to deploy your wallet
      <RadioGroup
        className='flex flex-col gap-y-2'
        value={selected}
        onChange={(e) => setSelected(e.currentTarget.value as BlockchainEnum)}
      >
        {[
          BlockchainEnum.MATIC_AMOY,
          BlockchainEnum.ETH_SEPOLIA,
          BlockchainEnum.AVAX_FUJI,
          BlockchainEnum.SOL_DEVNET,
        ].map((blockchain) => (
          <Sheet
            key={blockchain}
            sx={{
              borderRadius: "sm",
              boxShadow: "none",
            }}
          >
            <Radio
              disabled={
                createLoading ||
                !!walletsQuery.data?.data.wallets.find(
                  (wallet) => wallet.blockchain === blockchain,
                )
              }
              label={
                <div className='w-full justify-between flex'>
                  <span className='flex items-center gap-x-2'>
                    <Image
                      alt={`${blockchain}-icon`}
                      src={blockchainMeta(blockchain).svg}
                      width={16}
                      height={16}
                    />
                    {blockchainNames[blockchain]}
                  </span>
                  {selected === blockchain ? <CheckIcon width={16} /> : null}
                </div>
              }
              value={blockchain}
              disableIcon
              className={`w-full p-2`}
              slotProps={{
                action({ checked }) {
                  return {
                    sx: {
                      border: "none",
                      borderRadius: "sm",
                    },
                    className: checked ? `bg-blue-100` : undefined,
                  };
                },
              }}
            />
          </Sheet>
        ))}
      </RadioGroup>
      <div className='grow' />
      {loading && (
        <Typography level='body-xs' className='text-center'>
          Please wait while we create your brand new wallet.
        </Typography>
      )}
      <Button
        disabled={!selected || walletsQuery.isLoading}
        loading={createLoading}
        onClick={async () => {
          if (selected) {
            const { data: challengeId } =
              await createWalletMutation.mutateAsync({
                blockchain: selected,
              });

            client?.execute(challengeId, (err) => {
              setLoading(true);
              if (err) {
                setLoading(false);
                return; // handle error
              }

              setTimeout(() => {
                setLoading(false);
                router.push("/wallets");
              }, 5000);
            });
          }
        }}
      >
        Next: Enter Pin
      </Button>
    </Content>
  );
}
