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
