"use client";

import { useCreateWallet, useWallets } from "@/app/axios";
import { BackButton, Content, useW3sContext } from "@/app/components";
import { BlockchainEnum, blockchainNames } from "@/app/shared/types";
import { blockchainMeta } from "@/app/shared/utils";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Button, Radio, RadioGroup, Sheet, Typography } from "@mui/joy";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CreateWalletPage() {
  const createWalletMutation = useCreateWallet();
  const router = useRouter();
  const { client } = useW3sContext();

  const previousWalletsCount = useRef<number>(0); // Ref to hold the previous value

  const [selected, setSelected] = useState<BlockchainEnum>();
  const [loading, setLoading] = useState(false);

  const walletsQuery = useWallets(
    undefined,
    createWalletMutation.status === "success" ? 1000 : undefined,
  );

  useEffect(() => {
    // make sure first wallet is created.
    if (
      previousWalletsCount?.current > 0 &&
      previousWalletsCount.current !== walletsQuery.data?.data.wallets.length
    ) {
      router.push("/wallets");
    }

    previousWalletsCount.current = walletsQuery.data?.data.wallets.length ?? 0;
  }, [router, walletsQuery.data?.data.wallets.length]);

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
      {createLoading && (
        <Typography level='body-xs' className='text-center'>
          Please wait while we create your brand new wallet.
        </Typography>
      )}
      <Button
        disabled={!selected}
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
            });
          }
        }}
      >
        Create Wallet
      </Button>
    </Content>
  );
}
