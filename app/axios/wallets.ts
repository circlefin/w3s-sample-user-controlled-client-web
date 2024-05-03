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
import {
  TokenBalance,
  Wallet,
  WalletBalancesInput,
  WalletsInput,
} from "../shared/types";

const walletBalanceHelper = async (
  id: string,
  params?: WalletBalancesInput
) => {
  return axios.get<{
    tokenBalances: TokenBalance[];
  }>(`/wallets/${id}/balances`, {
    params: {
      name: params?.name,
    },
  });
};

export const useWalletBalances = (id: string, params?: WalletBalancesInput) => {
  return useQuery({
    queryKey: ["getWalletBalance", id, params],
    queryFn: () => walletBalanceHelper(id, params),
  });
};

const walletsHelper = async (params?: WalletsInput) => {
  return axios.get<{
    wallets: Wallet[];
  }>(`/wallets`, {
    params: {
      ...params,
    },
  });
};

export const useWallets = (params?: WalletsInput, refetchInterval?: any) => {
  return useQuery({
    queryKey: ["getWallets", params],
    queryFn: () => walletsHelper(params),
    refetchInterval: refetchInterval,
  });
};

const walletHelper = async (id: string) => {
  return axios.get<{
    wallet: Wallet;
  }>(`/wallets/${id}`);
};

export const useWallet = (id: string) => {
  return useQuery({
    queryKey: ["getWallet", id],
    queryFn: () => walletHelper(id),
  });
};
