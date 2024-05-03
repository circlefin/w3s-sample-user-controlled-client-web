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
import { axios } from "@/app/axios";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import {
  EstimateFeeInput,
  EstimateFeeResponse,
  Transaction,
} from "../shared/types";

// Get transactions query
const transactionsHelper = async (walletId: string) => {
  const response = await axios.get<{
    transactions: Transaction[];
  }>(`/transactions`, { params: { walletIds: [walletId] } });

  return response.data.transactions;
};

export const useTransactionsQuery = (walletId: string) => {
  return useQuery({
    queryKey: ["listTransactions", walletId],
    queryFn: () => transactionsHelper(walletId),
  });
};

// Get transaction details query
const transactionHelper = async (transactionId: string) => {
  const response = await axios.get<{
    transaction: Transaction;
  }>(`/transactions/${transactionId}`);

  return response.data.transaction;
};

export const useTransactionQuery = (transactionId: string) => {
  return useQuery({
    queryKey: ["getTransaction", transactionId],
    queryFn: () => transactionHelper(transactionId),
  });
};

// Estimate Transfer Fee
const estimateFeeHelper = async (input: EstimateFeeInput) => {
  const response = await axios.post<EstimateFeeResponse>(
    "/transactions/transfer/estimateFee",
    input
  );

  return response.data;
};

export const useEstimateFeeMutation = () => useMutation(estimateFeeHelper);

// Validate address for transaction mutation
const validateAddressMutationHelper = async ({
  address,
  blockchain,
}: {
  address: string;
  blockchain: string;
}) => {
  const { data } = await axios.post<{}, { data: { isValid: boolean } }>(
    "/transactions/validateAddress",
    {
      address,
      blockchain,
    }
  );

  return data;
};

export const useValidateAddressMutation = () =>
  useMutation(validateAddressMutationHelper);

// Create transaction mutation
const createTransferHelper = async (bodyParams: {
  destinationAddress: string;
  tokenId: string;
  walletId: string;
  amounts: string[];
  feeLevel: "LOW" | "MEDIUM" | "HIGH";
}) => {
  const response = await axios.post<{ challengeId: string }>(
    "/transactions/transfer",
    bodyParams
  );

  return response.data;
};

export const useCreateTransferMutation = () =>
  useMutation(createTransferHelper);
