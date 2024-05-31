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
import { restorePinHelper } from "@/app/axios";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const appId = process.env.NEXT_PUBLIC_APP_ID ?? "";

/**
 * Context State.
 */
interface ContextState {
  /**
   * W3s client context.
   */
  client: W3SSdk | undefined;
}

/**
 * Create Context.
 */
const W3sContext = createContext<ContextState>({ client: undefined });

export interface W3sProviderProps {
  /**
   * Child Nodes.
   */
  children?: React.ReactNode;
}

/**
 * W3s Provider.
 */
export const W3sProvider: React.FC<W3sProviderProps> = ({ children }) => {
  const [client, setClient] = useState<W3SSdk | undefined>(undefined);
  const { data: session } = useSession();

  useEffect(() => {
    if (client) {
      client.setResources({
        fontFamily: {
          name: "Inter",
          url: "https://fonts.cdnfonts.com/css/inter",
        },
      });
    }
  }, [client]);

  useEffect(() => {
    // Instantiate W3SSdk in useEffect because of Window Dependency
    if (!client) {
      const webClient = new W3SSdk();
      webClient?.setAppSettings({
        appId,
      });
      webClient?.setOnForgotPin(async () => {
        const challengeId = await restorePinHelper();
        if (challengeId) {
          webClient.execute(challengeId);
        }
      });
      setClient(webClient);
    }
  }, [client]);

  useEffect(() => {
    // When the session or clients updated
    // re-authenticate with WebSDK
    if (client && session) {
      const currUser = session.user;
      client.setAuthentication({
        userToken: currUser.userToken,
        encryptionKey: currUser.encryptionKey,
      });
    }
  }, [client, session]);

  return (
    <W3sContext.Provider value={{ client }}>{children}</W3sContext.Provider>
  );
};

/**
 * W3s context hook.
 */
export const useW3sContext = () => {
  return useContext(W3sContext);
};
