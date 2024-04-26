# Circle User-Controlled Wallets Sample App - Frontend UI

## Overview

User-Controlled Wallets Sample App showcases the integration of Circle's Web3 Services products (Web SDK, [Smart Contract Accounts (SCA)](https://developers.circle.com/w3s/docs/programmable-wallets-account-types) user-controlled wallets, gasless transactions). You can download and easily run and configure for your own projects. The use case it will be supporting is integrating user-controlled wallets into an existing web application, so that you can provide wallets to your end users.

This is a sample frontend UI that plays a part in the larger Sample App project. We use [Circle Web3 Services Web SDK](https://developers.circle.com/w3s/docs/web) to protect users' sensitive data like PINs or security answers, which will be used to interact with Circle APIs for [User-Controlled Wallets](https://developers.circle.com/w3s/reference/createuser). See more information about [Sample App](#additional-resources).

The frontend UI will play the role as `Your Application`, see [details](<https://developers.circle.com/w3s/docs/sdk-architecture-for-user-controlled-wallets#sdk-architecture>).
![image](https://files.readme.io/a2a1678-SDK_UserC_Wallets_Sequence__Detailed2x.png)

## Prerequisites

1. Sign up for [Circle's Dev Console](https://developers.circle.com/w3s/docs/circle-developer-account) to obtain an App ID. Side Bar Navigation: Programmable Wallets / User Controlled / Configurator

2. Install [nvm](https://github.com/nvm-sh/nvm) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable), these are required development tools.

## Configure the Sample App

Run `yarn env:config`, and you will see a `.env.local` file generated in the root directory:

- `NEXT_PUBLIC_APP_ID`: your App ID on Circle's Dev Console.
- `NEXT_PUBLIC_BASE_URL`: your backend server url.
- `NEXTAUTH_SECRET`: generate with `openssl rand -base64 32`.
- `NEXT_PUBLIC_BASE_PATH`: the base path for the application. Defaulted to `/pw-user-controlled/foundational`.

## Get Started

Run the following commands to start the UI at `localhost:3000`:

``` bash
nvm use
yarn install
yarn dev
```

1. `nvm use`: set node version.
2. `yarn install`: install dependencies.
3. `yarn dev`: run the server, hot reload is supported.
4. The main logic to interact with backend server is under `app/api`.
5. Please be aware that the [SDK user token](https://developers.circle.com/w3s/reference/getusertoken) will expire after 60 minutes.

## Additional Resources

- Sample App
  - [Backend Repo](https://github.com/circlefin/w3s-sample-user-controlled-server-node)
  - [Live Demo](http://sample-app.circle.com/pw-user-controlled/foundational)
  - Walkthrough Video: <TODO: link to video>
  
- [Circle Web3 Services Web SDK](https://developers.circle.com/w3s/docs/web-sdk-ui-customizations) supports UI customization, check [more examples](https://github.com/circlefin/w3s-pw-web-sdk).

- We use [Next.js](https://nextjs.org/) as [React](https://react.dev/) framework and [Joy UI](https://mui.com/joy-ui/getting-started/) as React component library.
- Need help: <customer-support@circle.com>
- Join our Discord community: <https://discord.com/invite/buildoncircle>
