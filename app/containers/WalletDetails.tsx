// Copyright (c) 2024, Circle Technologies, LLC. All rights reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";
import Button from "@mui/joy/Button";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import FaucetSvg from "/public/Faucet.svg";
import { TokenBalance } from "@/app/shared/types";
import { useRouter } from "next/navigation";
import {
  useWallet,
  useWalletBalances,
  useFaucetDripMutation,
} from "@/app/axios";
import { LoadingWrapper, Content, TokenCard } from "@/app/components";
import { Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useCallback, useMemo } from "react";
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
  const dripFaucet = useFaucetDripMutation();

  const mainBalance = useMemo(() => {
    if (!balanceData?.data) {
      return;
    }

    const sorted = balanceData.data.tokenBalances.sort((a, b) => {
      // if native token with amount go first
      if (a.token.isNative && parseFloat(a.amount) > 0) {
        return -1;
      }

      if (parseFloat(a.amount) > parseFloat(b.amount)) {
        return -1;
      }

      return 1;
    });

    return sorted[0];
  }, [balanceData?.data]);

  const getUsdc = useCallback(async () => {
    await dripFaucet.mutateAsync({
      address: walletData?.data.wallet.address ?? "",
      blockchain: walletData?.data.wallet.blockchain ?? "",
    });
  }, [
    dripFaucet,
    walletData?.data.wallet.address,
    walletData?.data.wallet.blockchain,
  ]);

  const nativeTokenInfo = tokenHelper(mainBalance?.token.name);
  const blockchainInfo = blockchainMeta(walletData?.data.wallet.blockchain);
  const isWalletEmpty =
    !isLoading && balanceData?.data.tokenBalances.length === 0;

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Content>
          {/* Token balance of the testnet main token?? */}
          <Typography
            className='text-3xl text-center max-w-80 mx-auto'
            fontWeight={700}
            level='title-lg'
          >
            {mainBalance?.amount ?? "0"}{" "}
            {mainBalance
              ? nativeTokenInfo.name
              : blockchainInfo.nativeTokenName}
          </Typography>
          <div className='flex flex-row justify-center gap-4 py-2'>
            <Button
              startDecorator={<ArrowDownIcon width={16} />}
              onClick={() => router.push(`/wallets/${id}/deposit`)}
            >
              Deposit
            </Button>
            {isWalletEmpty ? (
              <Button
                disabled={
                  dripFaucet.isLoading ||
                  dripFaucet.isSuccess ||
                  dripFaucet.isError
                }
                variant='outlined'
                startDecorator={<FaucetSvg width={20} />}
                onClick={getUsdc}
              >
                Get USDC
              </Button>
            ) : (
              <Button
                startDecorator={<ArrowUpIcon width={16} />}
                onClick={() => router.push(`/wallets/${id}/send`)}
              >
                Send
              </Button>
            )}
          </div>
          {isWalletEmpty && (
            <>
              <Image
                alt='no tokens'
                src={`/NoTokens.svg`}
                height={120}
                width={120}
                className='mx-auto'
              />
              <span className='text-center font-semibold text-gray-400'>
                {(dripFaucet?.status === "idle" ||
                  dripFaucet?.status === "loading") && (
                  <Typography level='title-lg' className='text-inherit'>
                    No tokens yet
                  </Typography>
                )}

                {dripFaucet.isSuccess && (
                  <Typography level='title-lg' className='text-inherit'>
                    Your funds have been requested, please wait up to 10 seconds
                    for the transaction to settle.
                  </Typography>
                )}

                {dripFaucet.isError && (
                  <Typography level='title-lg' className='text-inherit'>
                    Oops! There was an issue requesting tokens, please use our{" "}
                    <a
                      href='https://faucet.circle.com'
                      className='no-underline text-blue-500'
                      target='_blank'
                    >
                      public faucet.
                    </a>
                  </Typography>
                )}
              </span>
            </>
          )}
          {!isWalletEmpty && (
            <Tabs className='bg-transparent'>
              <TabList className='grid grid-cols-2'>
                <Tab color='primary'>Tokens</Tab>
                <Tab color='primary'>Activity</Tab>
              </TabList>
              <TabPanel value={0} className='px-0'>
                <div className='flex grow w-full flex-col gap-2'>
                  {balanceData?.data.tokenBalances.map(
                    (token: TokenBalance) => (
                      <TokenCard
                        key={token?.token.name}
                        amount={token?.amount}
                        token={token.token}
                      />
                    ),
                  )}
                </div>
              </TabPanel>

              <TabPanel className='px-0' value={1}>
                <WalletActivity id={id} />
              </TabPanel>
            </Tabs>
          )}
        </Content>
      </LoadingWrapper>
    </>
  );
};
