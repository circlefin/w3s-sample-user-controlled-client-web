"use client";
import { useState } from "react";
import { SendTokenProvider } from "@/app/components";
import { SendTokenConfirm } from "./SendTokenConfirm";
import { SendTokenForm } from "./SendTokenForm";
import { SendTokenSummary } from "./SendTokenSummary";

interface SendTokenProps {
  walletId: string;
  tokenName: string;
}

export const SendToken = ({ tokenName, walletId }: SendTokenProps) => {
  const [step, setStep] = useState(1);

  return (
    <SendTokenProvider
      setStep={setStep}
      tokenName={tokenName}
      walletId={walletId}
    >
      {step === 1 && <SendTokenForm />}
      {step === 2 && <SendTokenConfirm />}
      {step === 3 && <SendTokenSummary />}
    </SendTokenProvider>
  );
};
