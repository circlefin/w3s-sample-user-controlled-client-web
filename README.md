# Circle User-Controlled Wallets Sample App - Frontend UI

Check out the [live demo](https://user-controlled-wallets-sample-app.circle.com/) first to see what to expect!

## Overview

User-Controlled Wallets Sample App showcases the integration of Circle's Web3 Services products (Web SDK, [Smart Contract Accounts (SCA)](https://developers.circle.com/w3s/docs/programmable-wallets-account-types) user-controlled wallets, gasless transactions). You can download and easily run and configure for your own projects. The use case it will be supporting is integrating user-controlled wallets into an existing web application, so that you can provide wallets to your end users.

This is a sample frontend UI that plays a part in the larger Sample App project. We use [Circle Web3 Services Web SDK](https://developers.circle.com/w3s/docs/web) to protect users' sensitive data like PINs or security answers, which will be used to interact with Circle APIs for [User-Controlled Wallets](https://developers.circle.com/w3s/reference/createuser).

## Prerequisites

1. Sign up for [Circle's Dev Console](https://developers.circle.com/w3s/docs/circle-developer-account) to obtain an [App ID](https://console.circle.com/wallets/user/configurator). Side Bar Navigation: Programmable Wallets / User Controlled / Configurator

2. Install [nvm](https://github.com/nvm-sh/nvm), [openssl](https://formulae.brew.sh/formula/openssl@3), and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable), these are required development tools.

3. **_Important:_** Set up the [Sample Server](https://github.com/circlefin/w3s-sample-user-controlled-server-node) as well to get the end-to-end experience. Please be aware that the [SDK user token](https://developers.circle.com/w3s/reference/getusertoken) will expire after 60 minutes.

## Configure the Sample App

1. Run `yarn env:config`, and you will see a `.env` file generated in the root directory
2. Paste your [App ID](https://console.circle.com/wallets/user/configurator) with `[APP_ID goes here]` in the `.env` file.

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

## Architecture

The frontend UI will play the role as `Your Application`, see [details](<https://developers.circle.com/w3s/docs/sdk-architecture-for-user-controlled-wallets#sdk-architecture>).
![image](https://files.readme.io/a2a1678-SDK_UserC_Wallets_Sequence__Detailed2x.png)

## Code Structure

We use [Next.js](https://nextjs.org/) as [React](https://react.dev/) framework and [Joy UI](https://mui.com/joy-ui/getting-started/) as React component library.

- The main logic to interact with the Circle Web3 Services Web SDK is going to be in our client side component in `app/components`:
  - `providers/W3sProvider.tsx`: holds the value to setup and instantiate a SDK instance. Part of the setup is authorizing with the App ID,
  
      ```javascript
        webClient?.setAppSettings({
          appId,
        });
      ```

      setting up the forgot pin callback,

      ```javascript
        webClient?.setOnForgotPin(async () => {
          const response = await axios.post<{ challengeId: string }>(
            "/users/pin/restore",
          );
          if (response.data) {
            webClient.execute(response.data.challengeId);
          }
        });
      ```

      and authenticating with the user token + encryption key.

      ```javascript
        client.setAuthentication({
            userToken: currUser.userToken,
            encryptionKey: currUser.encryptionKey,
          });
      ```

  - `Authentication/AuthenticationForm.tsx` has an example of executing a challenge ID and cutomizing behavior based off a successful execution.

    ```javascript
      client.execute(session.user.challengeId, (error, result) => {
        if (error) {
          setFormMessage("An error occurred on PIN Setup. Please try again.");
        } else if (result) {
          router.push("/wallets");
        }
      });
    ```

- `app/(pages)` contains all the server side pages of this Next.js application. Any directory wrapped in `()` is a [route grouping](https://nextjs.org/docs/app/building-your-application/routing/route-groups).
  - `(authorized)/`: all server side pages that can only be viewed if the user has a valid session. Check out `(authorized)/layout.ts` to see session validation.
- The above are the most important files to get an understanding of this application. All other files are specific to this application and not crucial to using Circle Web3 Services Web SDK.

**Happy Coding!**

## Additional Resources
  
- [Circle Web3 Services Web SDK](https://developers.circle.com/w3s/docs/web-sdk-ui-customizations) supports UI customization, check [more examples](https://github.com/circlefin/w3s-pw-web-sdk).
- Need help: <customer-support@circle.com>
- Join our Discord community: <https://discord.com/invite/buildoncircle>
