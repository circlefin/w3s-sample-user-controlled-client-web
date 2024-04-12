"use client";
import { GasFeeObject } from "@/app/shared/types";
import { createContext, useContext, useState } from "react";

export type SendWalletTokenState = {
  address: string;
  amount: string;
  network: string;
  tokenId: string;
};

export const SendTokenContext = createContext<{
  tokenAndRecipient: SendWalletTokenState;
  setTokenAndRecipient: (f: SendWalletTokenState) => void;
  estimatedFee: GasFeeObject;
  setEstimatedFee: (f: GasFeeObject) => void;
  setStep: (f: number) => void;
  walletId: string;
  tokenName: string;
}>({
  setStep: () => {},
  tokenAndRecipient: {
    address: "",
    amount: "",
    network: "",
    tokenId: "",
  },
  setTokenAndRecipient: () => {},
  estimatedFee: {
    maxFee: "",
    priorityFee: "",
    gasLimit: "",
    gasPrice: "",
  },
  setEstimatedFee: () => {},
  walletId: "",
  tokenName: "",
});

export const useSendTokenContext = () => useContext(SendTokenContext);

export const SendTokenProvider = ({
  children,
  tokenName,
  walletId,
  setStep,
}: {
  children: React.ReactNode;
  tokenName: string;
  walletId: string;
  setStep: (f: number) => void;
}) => {
  const [formState, setFormState] = useState<SendWalletTokenState>({
    amount: "0",
    address: "",
    network: "",
    tokenId: "",
  });

  const [estimatedFee, setEstimatedFee] = useState<GasFeeObject>({
    maxFee: "",
    priorityFee: "",
    gasLimit: "",
    gasPrice: "",
  });

  return (
    <SendTokenContext.Provider
      value={{
        tokenAndRecipient: formState,
        setTokenAndRecipient: setFormState,
        estimatedFee,
        setEstimatedFee,
        setStep,
        walletId,
        tokenName,
      }}
    >
      {children}
    </SendTokenContext.Provider>
  );
};
