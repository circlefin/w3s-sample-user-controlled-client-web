"use client";
import { tokenHelper } from "@/app/shared/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  BackButton,
  Content,
  LoadingWrapper,
  useSendTokenContext,
  TextField,
} from "@/app/components";
import {
  useEstimateFeeMutation,
  useValidateAddressMutation,
} from "@/app/axios/transactions";
import { useRouter } from "next/navigation";
import { useWalletBalances } from "@/app/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography } from "@mui/joy";

export const SendTokenForm = () => {
  const {
    tokenName,
    walletId,
    tokenAndRecipient,
    setTokenAndRecipient,
    setStep,
    setEstimatedFee,
  } = useSendTokenContext();
  const imageSymbol = tokenHelper(tokenName);
  const router = useRouter();

  const estimateFeeMutation = useEstimateFeeMutation();
  const { data: tokenBalanceData, isLoading } = useWalletBalances(walletId, {
    name: tokenName,
  });

  const token = tokenBalanceData?.data.tokenBalances[0];

  const FormInputs = yup.object().shape({
    address: yup.string().required("Wallet Address required."),
    amount: yup
      .string()
      .test("Check positive nonzero integer", function (val, ctx) {
        if (val) {
          const num = parseFloat(val);
          return num > 0
            ? true
            : ctx.createError({
                message: "Enter a number that is larger than zero.",
              });
        } else {
          return true;
        }
      })
      .test("Check less than the wallet balance", function (val, ctx) {
        if (val && token) {
          const num = parseFloat(val);
          return num <= parseFloat(token.amount)
            ? true
            : ctx.createError({
                message: "Cannot send more than the wallet balance.",
              });
        } else {
          return true;
        }
      })
      .required("Amount required."),
  });

  type FormInputSchema = yup.InferType<typeof FormInputs>;

  const { register, handleSubmit, setValue, formState, setError, watch } =
    useForm<FormInputSchema>({
      resolver: yupResolver(FormInputs),
      defaultValues: {
        amount: tokenAndRecipient.amount,
        address: tokenAndRecipient.address,
      },
    });

  const validateAddressMutation = useValidateAddressMutation();

  const submitHandler = async (data: FormInputSchema) => {
    const resp = await validateAddressMutation.mutateAsync({
      address: data.address,
      blockchain: token?.token.blockchain ?? "",
    });

    if (resp.isValid === false) {
      setError("address", {
        message: "The address you entered is invalid. Please double-check it.",
      });
      return;
    }
    const tokenId = token?.token.id ?? "";

    const estimatedFee = await estimateFeeMutation.mutateAsync({
      destinationAddress: data.address,
      tokenId: tokenId,
      walletId,
      amount: [data.amount],
    });

    setEstimatedFee(estimatedFee.low);
    setTokenAndRecipient({
      network: token?.token.blockchain ?? "",
      tokenId: tokenId,
      ...data,
    });
    setStep(2);
  };

  return (
    <LoadingWrapper isLoading={isLoading}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="h-full flex flex-col"
      >
        <div className="grow">
          <Content>
            <nav>
              <BackButton onClick={router.back}>
                Send {token?.token.symbol}
              </BackButton>
            </nav>
            <div className="grow flex flex-col items-center gap-y-4 p-2">
              <Image
                alt="token icon"
                height={80}
                width={80}
                src={imageSymbol.svg}
              />

              <Typography level="body-lg" fontWeight={500}>
                {token?.amount} {token?.token.symbol} available
              </Typography>

              <TextField
                {...register("address")}
                className="w-full"
                error={!!formState.errors.address?.message}
                helperText={formState.errors.address?.message}
                placeholder="Recipient Address"
              />
              <TextField
                {...register("amount")}
                error={!!formState.errors.amount?.message}
                placeholder="Amount"
                endDecorator={
                  <Button
                    size="sm"
                    onClick={() => {
                      setValue("amount", token?.amount ?? "");
                    }}
                  >
                    Max
                  </Button>
                }
                helperText={formState.errors.amount?.message}
              />
            </div>
            <Button
              loading={formState.isSubmitting}
              disabled={token?.amount === "0"}
              type="submit"
            >
              Next
            </Button>
          </Content>
        </div>
      </form>
    </LoadingWrapper>
  );
};
