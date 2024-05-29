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

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssVarsProvider, CssBaseline } from "@mui/joy";
import { SessionProvider } from "next-auth/react";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { W3sProvider } from "./W3sProvider";

const queryClient = new QueryClient();

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeRegistry options={{ key: "joy" }}>
          <W3sProvider>{children}</W3sProvider>
        </ThemeRegistry>
      </QueryClientProvider>
    </SessionProvider>
  );
};

// copied from joy-ui docs.
// https://mui.com/joy-ui/integrations/next-js-app-router/#using-joy-ui-with-the-app-router

function ThemeRegistry(props: any) {
  const { options, children } = props;

  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <CssVarsProvider>
        {/* the custom theme is optional */}
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </CacheProvider>
  );
}
