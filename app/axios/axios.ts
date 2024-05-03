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

import ax, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const axios = ax.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

axios.interceptors.request.use(async (request) => {
  const tokenDefault = axios.defaults.headers.token;

  // if token header not set
  if (!Boolean(tokenDefault)) {
    const session = await getSession({
      req: request,
    });

    if (session) {
      const bearerToken = `Bearer ${session.user.userToken}`;
      request.headers.Authorization = bearerToken;
      axios.defaults.headers.Authorization = bearerToken;
    }
  }

  return request;
});

axios.interceptors.response.use(undefined, async (error: unknown) => {
  if (error instanceof AxiosError && error.response?.status === 403) {
    await signOut({
      callbackUrl: "/signin",
      redirect: true,
    });
  }
});

export { axios };
