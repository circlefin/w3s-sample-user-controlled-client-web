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
import { MegaphoneIcon } from "@heroicons/react/16/solid";
import { useWallets } from "@/app/axios";
import { useEffect, useState } from "react";
import { LoadingWrapper } from "@/app/components";
import { UseQueryOptions } from "react-query";
import { Button } from "@mui/joy";
import { signOut } from "next-auth/react";

export default function WalletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const refetchIntervalFn: UseQueryOptions["refetchInterval"] = (
    _data,
    query
  ) => {
    if (query.state.dataUpdateCount < 3) {
      return 2000;
    } else {
      setLoading(false);
      return false;
    }
  };
  const { data: wallets } = useWallets(undefined, refetchIntervalFn);

  useEffect(() => {
    if (wallets && wallets.data?.wallets?.length > 0) {
      // redirect to the first wallet
      const firstWallet = wallets.data.wallets[0];
      const walletId = firstWallet.id;
      router.push(`/wallets/${walletId}`);
    }
  }, [router, wallets]);

  return (
    <div className="grid justify-center items-center h-1/2">
      <LoadingWrapper isLoading={loading}>
        <p>
          No Wallets at this time <MegaphoneIcon />
        </p>

        <Button variant="outlined" onClick={() => signOut()}>
          Sign out
        </Button>
      </LoadingWrapper>
    </div>
  );
}
