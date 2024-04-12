"use client";
import Button from "@mui/joy/Button";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import { TokenBalance } from "@/app/shared/types";
import { useRouter } from "next/navigation";
import { useWallet, useWalletBalances } from "@/app/axios/wallets";
import { LoadingWrapper, Content, TokenCard } from "@/app/components";
import { Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useMemo } from "react";
import { blockchainMeta, tokenHelper } from "../shared/utils";
import { WalletActivity } from "./WalletActivity";
import Image from "next/image";

interface WalletDetailsProps {
  id: string;
}

export const WalletDetails: React.FC<WalletDetailsProps> = ({ id }) => {
  const router = useRouter();

  const { data: balanceData, isLoading } = useWalletBalances(id);
  const { data: walletData } = useWallet(id);

  const mainBalance = useMemo(() => {
    if (!balanceData?.data) {
      return;
    }

    return balanceData.data.tokenBalances.find(
      (balance) => balance.token.isNative
    );
  }, [balanceData?.data]);

  const nativeTokenInfo = tokenHelper(mainBalance?.token.name);
  const blockchainInfo = blockchainMeta(walletData?.data.wallet.blockchain);

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Content>
          {/* Token balance of the testnet main token?? */}
          <Typography
            className="text-3xl text-center max-w-80 mx-auto"
            fontWeight={700}
            level="title-lg"
          >
            {mainBalance?.amount ?? "0"}{" "}
            {mainBalance
              ? nativeTokenInfo.name
              : blockchainInfo.nativeTokenName}
          </Typography>
          <div className="flex flex-row justify-center gap-4 py-2">
            <Button
              startDecorator={<ArrowDownIcon width={16} />}
              onClick={() => router.push(`/wallets/${id}/deposit`)}
            >
              Deposit
            </Button>
            <Button
              disabled={
                !isLoading && balanceData?.data.tokenBalances.length === 0
              }
              startDecorator={<ArrowUpIcon width={16} />}
              onClick={() => router.push(`/wallets/${id}/send`)}
            >
              Send
            </Button>
          </div>

          <Tabs className="bg-transparent">
            <TabList className="grid grid-cols-2">
              <Tab color="primary">Tokens</Tab>
              <Tab color="primary">Activity</Tab>
            </TabList>
            <TabPanel value={0} className="px-0">
              <div className="flex grow w-full flex-col gap-2">
                {!isLoading &&
                  balanceData?.data.tokenBalances.map((token: TokenBalance) => (
                    <TokenCard
                      key={token?.token.name}
                      amount={token?.amount}
                      token={token.token}
                    />
                  ))}
                {!isLoading && balanceData?.data.tokenBalances.length === 0 && (
                  <>
                    <Image
                      alt="no tokens"
                      src="/NoTokens.svg"
                      height={120}
                      width={120}
                      className="mx-auto"
                    />
                    <Typography
                      level="title-lg"
                      className="text-center font-semibold text-gray-400"
                    >
                      No tokens yet
                    </Typography>
                  </>
                )}
              </div>
            </TabPanel>

            <TabPanel value={1}>
              <div className="flex grow w-full flex-col gap-2">
                <WalletActivity id={id} />
              </div>
            </TabPanel>
          </Tabs>
        </Content>
      </LoadingWrapper>
    </>
  );
};
