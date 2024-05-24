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

import Image from "next/image";
import { formatDate, tokenHelper } from "@/app/shared/utils";
import { Button } from "@mui/joy";
import { Content, CopyButton, useSendTokenContext } from "@/app/components";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { BlockchainEnum, blockchainNames } from "@/app/shared/types";
import { TextField } from "@/app/components/TextField";

export const SendTokenSummary: React.FC = () => {
  const { tokenName, tokenAndRecipient } = useSendTokenContext();

  const imageSymbol = tokenHelper(tokenName);
  const router = useRouter();
  const date = useMemo(() => new Date(), []);
  return (
    <>
      <Content>
        <div className='flex flex-col items-center mb-4'>
          <Image
            className='mb-4'
            src={`/Success.gif`}
            width={80}
            height={80}
            alt='Success'
          />

          <span className='text-3xl text-center font-semibold max-w-80'>
            Sent {tokenAndRecipient.amount} {imageSymbol.symbol}
          </span>
        </div>
        <div className='grow flex flex-col gap-y-2'>
          <TextField
            value={tokenAndRecipient.address}
            label='To'
            endDecorator={<CopyButton copyValue={tokenAndRecipient.address} />}
            readOnly
          />
          <TextField
            value={blockchainNames[tokenAndRecipient.network as BlockchainEnum]}
            label='Network'
            readOnly
          />
          <TextField value={formatDate(date)} label='Date' readOnly />
        </div>
        <Button
          className='w-full'
          variant='solid'
          onClick={() => {
            router.push("/wallets");
          }}
        >
          Go to home
        </Button>
      </Content>
    </>
  );
};
