import { CardContent, Typography } from "@mui/joy";
import Card from "@mui/joy/Card";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

import { tokenHelper } from "@/app/shared/utils";
import Image from "next/image";
import { Token } from "@/app/shared/types";

interface TokenCardProps {
  token?: Token;
  amount: string;
  onClick?: () => void;
}

/**
 * Token balance card.
 */
export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  amount,
  onClick,
}) => {
  const tokenMeta = tokenHelper(token?.name);

  return (
    <Card
      className={`rounded-lg bg-white ${onClick ? "cursor-pointer hover:bg-slate-50 transition-all" : ""}`}
      onClick={onClick}
    >
      <CardContent className="flex flex-row gap-6">
        {tokenMeta.svg !== "" ? (
          <Image
            alt="token"
            height={36}
            width={36}
            src={tokenMeta.svg}
            className="my-auto"
          />
        ) : (
          <ExclamationCircleIcon width={40} height={40} />
        )}
        <div>
          <Typography level="body-md">{tokenMeta.name}</Typography>

          <Typography level="body-sm">{`${amount} ${tokenMeta.name}`}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};
