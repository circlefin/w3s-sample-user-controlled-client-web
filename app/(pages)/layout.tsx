"use client";
import "../globals.css";

import createCache from "@emotion/cache";
import { QueryClient, QueryClientProvider } from "react-query";
import { W3sProvider } from "../components/Providers/W3sProvider";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { CacheProvider } from "@emotion/react";
import { CssVarsProvider, CssBaseline } from "@mui/joy";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["cyrillic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="__next">
          <SessionProvider basePath={`${basePath}/api/auth`}>
            <QueryClientProvider client={queryClient}>
              <W3sProvider>
                <ThemeRegistry options={{ key: "joy" }}>
                  <div className="flex justify-center items-center h-screen px-4">
                    <div className="max-w-xl w-full h-full max-h-[660px] border border-solid border-gray-200 rounded-lg shadow-lg flex flex-col relative overflow-hidden">
                      <span className="bg-purple-500 text-white p-3 font-medium flex items-center gap-x-2.5">
                        <Image
                          src={`${basePath}/CircleLogo.svg`}
                          alt="Circle Logo"
                          width={20}
                          height={20}
                        />{" "}
                        Your app here
                      </span>
                      {children}
                    </div>
                  </div>
                </ThemeRegistry>
              </W3sProvider>
            </QueryClientProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}

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
