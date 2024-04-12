import {
  BackButton,
  Content,
  CopyButton,
  useSendTokenContext,
  useW3sContext,
} from "@/app/components";
import Image from "next/image";
import {
  calculateEstimatedFee,
  roundNum,
  tokenHelper,
} from "@/app/shared/utils";
import { Button, Chip } from "@mui/joy";
import { useCreateTransferMutation } from "@/app/axios";
import { BlockchainEnum, blockchainNames } from "@/app/shared/types";
import { TextField } from "@/app/components/TextField";
import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

export const SendTokenConfirm = () => {
  const { tokenName, walletId, setStep, tokenAndRecipient, estimatedFee } =
    useSendTokenContext();
  const [loading, setLoading] = useState(false);
  const { client } = useW3sContext();
  const transferMutation = useCreateTransferMutation();

  const imageSymbol = tokenHelper(tokenName);

  const handleSubmit = async () => {
    setLoading(true);
    const { challengeId } = await transferMutation.mutateAsync({
      destinationAddress: tokenAndRecipient.address,
      tokenId: tokenAndRecipient.tokenId,
      walletId,
      amounts: [tokenAndRecipient.amount],
      feeLevel: "LOW",
    });

    client?.execute(challengeId, (error) => {
      if (!error) {
        setStep(3);
      }
    });
    setLoading(false);
  };

  return (
    <>
      <Content>
        <nav>
          <BackButton onClick={() => setStep(1)}>Summary</BackButton>
        </nav>

        <div className="flex flex-col items-center mb-4">
          <Image
            className="mb-4"
            src={imageSymbol.svg}
            width={80}
            height={80}
            alt="coin alt"
          />

          <span className="text-3xl text-center font-semibold max-w-80">
            {tokenAndRecipient.amount} {imageSymbol.symbol}
          </span>
        </div>

        {/* Some table here for the amounts */}
        <div className="grow">
          <TextField 
            value={tokenAndRecipient.address} 
            label="To"
            endDecorator={<CopyButton copyValue={tokenAndRecipient.address} />}
            readOnly
          />
          <TextField 
            value={blockchainNames[tokenAndRecipient.network as BlockchainEnum]}
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
            label="Estimated Gas Fee"
            value={`${roundNum(String(calculateEstimatedFee(estimatedFee)), 8)} ${tokenAndRecipient.network}`}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="w-full"
            variant="solid"
            onClick={handleSubmit}
            loading={loading}
            endDecorator={ <PaperAirplaneIcon width={16} /> }
          >
            Send
          </Button>
        </div>
      </Content>
    </>
  );
};
