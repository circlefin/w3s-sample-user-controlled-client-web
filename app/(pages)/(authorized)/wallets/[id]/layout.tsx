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
import { CopyButton, useW3sContext } from "@/app/components";
import { blockchainMeta, getAddressAbbreviation } from "@/app/shared/utils";
import {
  CircularProgress,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
} from "@mui/joy";
import { signOut } from "next-auth/react";
import { useRestorePinMutation, useWallet } from "@/app/axios";
import Image from "next/image";
import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/16/solid";

type WalletLayoutParams = {
  /*
   * Wallet id.
   */
  id: string;
};

export default function WalletLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: WalletLayoutParams;
}) {
  const { client } = useW3sContext();
  const { data: wallet } = useWallet(params.id);
  const restorePin = useRestorePinMutation();

  const blockchainInfo = blockchainMeta(wallet?.data.wallet.blockchain);
  const walletAddress = wallet?.data.wallet.address ?? "";

  const handleChangePin = async () => {
    const challengeId = await restorePin.mutateAsync();

    client?.execute(challengeId, (error) => {
      if (!error) {
        // handle successful changing of pin.
        alert("Your pin has successfully been reset");
      }

      // handle change pin error (e.g. user closed out, bad answers, etc).
    });
  };

  const handleSignOut = () =>
    signOut({
      redirect: true,
      callbackUrl: process.env.NEXTAUTH_URL,
    });

  return (
    <>
      {/* Wallet Address */}
      <div className='flex p-5 justify-between items-center relative gap-x-4'>
        <Tooltip title={blockchainInfo.testnet} placement='bottom-start'>
          <IconButton>
            <Image
              alt='blockchain'
              src={blockchainInfo.svg}
              width={20}
              height={20}
            />
          </IconButton>
        </Tooltip>

        <CopyButton
          copyValue={walletAddress}
          copyLabel={getAddressAbbreviation(walletAddress)}
        />

        <Dropdown>
          <MenuButton
            disabled={restorePin.isLoading}
            variant='plain'
            className='px-2 text-slate-600'
          >
            {restorePin.isLoading ? (
              <CircularProgress color='neutral' />
            ) : (
              <EllipsisVerticalIcon className='text-slate-600' height={20} />
            )}
          </MenuButton>
          <Menu placement='bottom-end' size='sm'>
            <MenuItem onClick={handleChangePin}>
              <Cog6ToothIcon width={16} /> Change Pin
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <ArrowRightStartOnRectangleIcon width={16} />
              Sign out
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>
      {children}
    </>
  );
}
