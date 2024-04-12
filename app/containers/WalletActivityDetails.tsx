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
    transaction
  );

  const tokenId = transaction?.tokenId ?? "";
  const { data: tokenDetails, isLoading } = useTokenDetailsQuery(tokenId, transaction?.tokenId !== undefined);
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
            <BackButton onClick={router.back}>
              Activity
            </BackButton>
          </nav>

          {/* Transaction Amount */}
          <div className="flex items-center justify-center mx-auto self-stretch">
            <Typography level="h4" className="py-3">
              {`${operation} ${transaction?.amounts?.[0]} ${tokenDetails?.symbol}`}
            </Typography>
          </div>

          {/* Transaction Details */}
          <div className="grow">
              {operation == "Deposited" && 
                <TextField
                  value={transaction?.sourceAddress}
                  label="From"
                  endDecorator={<CopyButton copyValue={transaction?.sourceAddress ?? ""} />}
                  readOnly
                />
              }
              <TextField 
                value={transaction?.destinationAddress} 
                label="To"
                endDecorator={<CopyButton copyValue={transaction?.destinationAddress ?? ""} />}
                readOnly
              />
              <TextField 
                value={blockchainNames[transaction?.blockchain ?? ""]} 
                label="Network"
                readOnly
              />
              <TextField 
                readOnly 
                startDecorator={
                 <Chip
                   color="success"
                   size="md"
                   variant="solid"
                 >
                   Paid By Circle
                 </Chip>
                } 
                label="Gas Fee"
                value={`${roundNum(transaction?.networkFee ?? "0", 8)} ${transaction?.blockchain}`}
              />
              <TextField 
                value={transaction?.txHash} 
                label="Transaction Hash"
                endDecorator={<CopyButton copyValue={transaction?.txHash ?? ""} />}
              />
              <TextField 
               readOnly 
               label="Status"
               startDecorator={
                transaction?.state && <Chip
                  color={findChipColor(transaction.state)}
                  size="md"
                  variant="solid"
                >
                  {transaction.state}
                </Chip>
                }
              />
              <TextField 
                value={`${date.toLocaleTimeString()} ${formatDate(date)}`}
                label="Date"
                readOnly
              />
          </div>
          <Button onClick={() => router.push("/wallets")}>Go to home</Button>
        </Content>
        
      </LoadingWrapper>
    </>
  );
};
