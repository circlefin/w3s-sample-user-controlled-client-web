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
import { axios } from "@/app/axios";
import { useQuery } from "react-query";
import { Token } from "../shared/types";

const tokenDetailsHelper = async (tokenId: string) => {
  const response = await axios.get<{
    token: Token;
  }>(`/tokens/${tokenId}`);

  return response.data.token;
};

export const useTokenDetailsQuery = (tokenId: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["getTokenDetails", tokenId],
    queryFn: () => tokenDetailsHelper(tokenId),
    enabled: enabled ?? true
  });
};
