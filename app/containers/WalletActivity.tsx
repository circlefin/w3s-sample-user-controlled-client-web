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
  useTokenDetailsQuery,
  useTransactionsQuery,
  useWallet,
} from "@/app/axios";
import { LoadingWrapper } from "@/app/components";
import Image from "next/image";
import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Divider,
} from "@mui/joy";
import { Transaction } from "../shared/types";
import { useRouter } from "next/navigation";
import { MegaphoneIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { getTransactionOperation, formatDate } from "../shared/utils";

interface WalletActivityProps {
  id: string;
}

export const WalletActivity: React.FC<WalletActivityProps> = ({ id }) => {
  const { data: transactions, isLoading } = useTransactionsQuery(id);
  const { data: wallet } = useWallet(id);

  if (!isLoading && transactions?.length === 0) {
    return (
      <div className='flex flex-col items-center'>
        <Image
          alt='no tokens'
          src={`/NoActivity.svg`}
          height={80}
          width={80}
          className='mx-auto mt-6 mb-6'
        />
        <Typography
          level='title-lg'
          className='text-center font-semibold text-gray-400'
        >
          No activity yet
        </Typography>
      </div>
    );
  }

  return (
    <LoadingWrapper isLoading={isLoading}>
      {transactions?.length && (
        <List className='py-0 px-0'>
          {transactions?.map((transaction: Transaction, index: number) => (
            <div key={transaction.id}>
              <TransactionRow
                transaction={transaction}
                walletId={id}
                walletAddress={wallet?.data.wallet.address ?? ""}
              />
              {index !== transactions.length - 1 && (
                <Divider orientation='horizontal' className='w-full' />
              )}
            </div>
          ))}
        </List>
      )}
      {!transactions?.length && (
        <div>
          <p className='text-center'>
            No transactions for this wallet
            <MegaphoneIcon className='m-2' />
          </p>
        </div>
      )}
    </LoadingWrapper>
  );
};

const TransactionRow = ({
  transaction,
  walletId,
  walletAddress,
}: {
  transaction: Transaction;
  walletId: string;
  walletAddress: string;
}) => {
  const router = useRouter();

  const { operation, operator } = getTransactionOperation(
    walletAddress,
    transaction,
  );

  const tokenId = transaction?.tokenId ?? "";
  const { data: tokenDetails } = useTokenDetailsQuery(
    tokenId,
    transaction.tokenId !== undefined,
  );
  const date = useMemo(() => {
    return transaction?.createDate
      ? new Date(transaction.createDate)
      : new Date();
  }, [transaction?.createDate]);

  return (
    <ListItem>
      <ListItemButton
        className='flex justify-between w-full py-2'
        onClick={() =>
          router.push(`/wallets/${walletId}/activity/${transaction.id}`)
        }
      >
        <div className='flex items-center gap-4'>
          <span className='w-16'>
            <Chip color='primary' variant='solid' size='sm'>
              {operation}
            </Chip>
          </span>
          <span>
            <Typography level='body-md'>
              {operator}
              {transaction.amounts && transaction.amounts[0]}{" "}
              {tokenDetails?.symbol}
            </Typography>
            <Typography level='body-sm'>{formatDate(date)}</Typography>
          </span>
        </div>
        <ChevronRightIcon width={24} />
      </ListItemButton>
    </ListItem>
  );
};
