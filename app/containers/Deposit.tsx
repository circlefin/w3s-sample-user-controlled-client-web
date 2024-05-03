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

import { useRouter } from "next/navigation";

import QRCode from "react-qr-code";

import { useWallet } from "@/app/axios";
import { Content, BackButton, CopyButton } from "@/app/components";
import { Typography } from "@mui/joy";

interface DepositProps {
  walletId: string;
}

export const Deposit: React.FC<DepositProps> = ({ walletId }) => {
  const router = useRouter();

  const { data: wallet } = useWallet(walletId);
  const walletAddress = wallet?.data.wallet.address ?? "";

  return (
    <Content>
      <nav>
        <BackButton onClick={router.back}>Deposit</BackButton>
      </nav>
      <div className="flex flex-col items-center justify-center mx-auto self-stretch gap-8 w-full">
        <Typography>
          Use the QR code or wallet address to deposit directly to this wallet.
        </Typography>
        <QRCode value={walletAddress} />
        <CopyButton
          variant="solid"
          copyValue={walletAddress}
          copyLabel={walletAddress}
        />
      </div>
    </Content>
  );
};
