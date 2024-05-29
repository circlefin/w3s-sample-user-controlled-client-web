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

import {
  findChipColor,
  formatDate,
  getTransactionOperation,
  roundNum,
} from "@/app/shared/utils";
import { Button, Chip, Typography } from "@mui/joy";

import { useRouter } from "next/navigation";
import { useTokenDetailsQuery } from "@/app/axios/tokens";
import { useTransactionQuery } from "@/app/axios/transactions";
import { blockchainNames } from "../shared/types";
import { useMemo } from "react";

import { useWallet } from "@/app/axios";
import {
  LoadingWrapper,
  Content,
  BackButton,
  CopyButton,
} from "@/app/components";
import { TextField } from "../components/TextField";

interface WalletActivityDetailsProps {
  walletId: string;
  transactionId: string;
}

export const WalletActivityDetails: React.FC<WalletActivityDetailsProps> = ({
  walletId,
  transactionId,
}) => {
  const router = useRouter();
  const { data: transaction } = useTransactionQuery(transactionId);
  const { data: wallet } = useWallet(walletId);
  const { operation } = getTransactionOperation(
    wallet?.data.wallet.address ?? "",
    transaction,
  );

  const tokenId = transaction?.tokenId ?? "";
  const { data: tokenDetails, isLoading } = useTokenDetailsQuery(
    tokenId,
    transaction?.tokenId !== undefined,
  );
  const date = useMemo(() => {
    return transaction?.createDate
      ? new Date(transaction.createDate)
      : new Date();
  }, [transaction?.createDate]);

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Content>
          {/* Return to Wallet Activity Page */}
          <nav>
            <BackButton onClick={router.back}>Activity</BackButton>
          </nav>

          {/* Transaction Amount */}
          <Typography level='h2' className='text-center my-2'>
            {`${operation} ${transaction?.amounts?.[0]} ${tokenDetails?.symbol}`}
          </Typography>

          {/* Transaction Details */}
          <div className='space-y-2 grow'>
            {operation == "Deposited" && (
              <TextField
                value={transaction?.sourceAddress ?? ""}
                label='From'
                endDecorator={
                  <CopyButton copyValue={transaction?.sourceAddress ?? ""} />
                }
                readOnly
              />
            )}
            <TextField
              value={transaction?.destinationAddress ?? ""}
              label='To'
              endDecorator={
                <CopyButton copyValue={transaction?.destinationAddress ?? ""} />
              }
              readOnly
            />
            <TextField
              value={blockchainNames[transaction?.blockchain ?? ""]}
              label='Network'
              readOnly
            />
            <TextField
              readOnly
              startDecorator={
                <Chip color='success' size='md' variant='solid'>
                  Paid By Circle
                </Chip>
              }
              label='Gas Fee'
              value={`${roundNum(transaction?.networkFee ?? "0", 8)} ${transaction?.blockchain}`}
            />
            <TextField
              value={transaction?.txHash ?? "Not yet available"}
              label='Transaction Hash'
              endDecorator={
                <CopyButton copyValue={transaction?.txHash ?? ""} />
              }
            />
            <TextField
              readOnly
              label='Status'
              startDecorator={
                transaction?.state && (
                  <Chip
                    color={findChipColor(transaction.state)}
                    size='md'
                    variant='solid'
                  >
                    {transaction.state}
                  </Chip>
                )
              }
            />
            <TextField
              value={`${date.toLocaleTimeString()} ${formatDate(date)}`}
              label='Date'
              readOnly
            />
          </div>
          <Button onClick={() => router.push("/wallets")}>Go to home</Button>
        </Content>
      </LoadingWrapper>
    </>
  );
};
