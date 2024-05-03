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
import { useWalletBalances } from "@/app/axios";
import {
  BackButton,
  Content,
  LoadingWrapper,
  TokenCard,
} from "@/app/components";
import { useRouter } from "next/navigation";
import { MegaphoneIcon } from "@heroicons/react/16/solid";

interface SelectTokenProps {
  walletId: string;
}

export const SelectToken = ({ walletId }: SelectTokenProps) => {
  const { data, isLoading } = useWalletBalances(walletId);
  const router = useRouter();
  const tokenBalances = data?.data.tokenBalances;

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Content>
        <nav>
          <BackButton onClick={router.back}>Select a token to send</BackButton>
        </nav>

        <ul className="list-none space-y-2 px-0">
          {tokenBalances && tokenBalances.length > 0 ? (
            tokenBalances.map((tokenBalance) => (
              <li key={tokenBalance?.token.name}>
                <TokenCard
                  amount={tokenBalance?.amount}
                  token={tokenBalance?.token}
                  onClick={() =>
                    router.push(
                      `/wallets/${walletId}/send/${encodeURIComponent(tokenBalance.token.name ?? "")}`
                    )
                  }
                />
              </li>
            ))
          ) : (
            <p className="text-center">
              No Tokens to send <MegaphoneIcon />
            </p>
          )}
        </ul>
      </Content>
    </LoadingWrapper>
  );
};
