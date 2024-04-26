import { NextAuthOptions, Session, User } from "next-auth";
import { axios } from "@/app/axios";
import CredentialsProvider from "next-auth/providers/credentials";
import { GasFeeObject, Transaction, TransactionStateEnum, TransactionTypeEnum } from "./types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const calculateSum = (amounts: string[]): string => {
  const finalSum = amounts.reduce((sum, amount) => Number(amount) + sum, 0);
  return String(finalSum);
};

export const roundNum = (num: string, decimals: number): string => {
  return Number(num).toFixed(decimals);;
}

export const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const findChipColor = (state: TransactionStateEnum) => {
  switch (state) {
    case TransactionStateEnum.INITIATED:
      return "primary";
    case TransactionStateEnum.PENDING_RISK_SCREENING:
      return "primary";
    case TransactionStateEnum.DENIED:
      return "neutral";
    case TransactionStateEnum.QUEUED:
      return "primary";
    case TransactionStateEnum.SENT:
      return "primary";
    case TransactionStateEnum.CONFIRMED:
      return "primary";
    case TransactionStateEnum.COMPLETE:
      return "success";
    case TransactionStateEnum.FAILED:
      return "danger";
    case TransactionStateEnum.CANCELLED:
      return "neutral";
  }
}

export const getAddressAbbreviation = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-6);
};

export const calculateEstimatedFee = (estimatedFee: GasFeeObject): number => {
  return (
    (parseFloat(estimatedFee.maxFee) + parseFloat(estimatedFee.priorityFee)) *
    parseFloat(estimatedFee.gasLimit) *
    10 ** -9
  );
};

export const blockchainIcon = (blockchain: string | undefined) => {
  switch (blockchain) {
    case "MATIC-AMOY":
    case "MATIC-MUMBAI":
      return `${basePath}/Poly.svg`;
    case "ETH-SEPOLIA":
      return `${basePath}/Eth.svg`;
    case "AVAX-FUJI":
      return `${basePath}/Avax.svg`;
    default:
      return "";
  }
};

// only testnet blockchains.
export const blockchainMeta = (blockchain: string | undefined) => {
  switch (blockchain) {
    case "MATIC-AMOY":
      return {
        svg: `${basePath}/Poly.svg`,
        testnet: "Matic Amoy Testnet",
        nativeTokenName: "AmoyMATIC",
      };
    case "MATIC-MUMBAI":
      return {
        svg: `${basePath}/Poly.svg`,
        testnet: "Matic Mumbai Testnet",
        nativeTokenName: "MumbaiMATIC",
      };
    case "ETH-SEPOLIA":
      return {
        svg: `${basePath}/Eth.svg`,
        testnet: "Ethereum Sepolia Testnet",
        nativeTokenName: "SepoliaEth",
      };
    default:
      return {
        svg: "",
        testnet: "",
        nativeTokenName: "",
      };
  }
};

// TODO: need to update these token helpers.
export const tokenHelper = (tokenName: string | undefined) => {
  switch (tokenName) {
    case "Ethereum-Sepolia":
      return {
        svg: `${basePath}/Eth.svg`,
        symbol: "ETH",
        name: "SepoliaETH",
      };
    case "Polygon-Amoy":
      return {
        svg: `${basePath}/Poly.svg`,
        symbol: "MATIC-AMOY",
        name: "AmoyMATIC",
      };
    case "Polygon-Mumbai":
    case "Polygon":
      return {
        svg: `${basePath}/Poly.svg`,
        symbol: "MATIC-MUMBAI",
        name: "MumbaiMATIC",
      };
    case "USD Coin":
    case "USDC":
      return {
        svg: `${basePath}/USDC.svg`,
        symbol: "USDC",
        name: "USDC",
      };
    default:
      return {
        svg: "",
        symbol: "",
      };
  }
};

export const getTransactionOperation = (
  walletAddress: string,
  transaction?: Transaction
) => {
  const isSend =
    transaction?.sourceAddress === walletAddress &&
    transaction?.transactionType === TransactionTypeEnum.OUTBOUND;
  const operation = isSend ? "Sent" : "Deposited";
  const operator = isSend ? "-" : "+";

  return { operation, operator };
};

export const validOnboardStatus = async (session: Session): Promise<boolean> => {
  try {
    const response = await axios.get<{ 
      user: {
        securityQuestionStatus: string, 
        pinStatus: string 
      } 
    }>(`/users/${session.user.userId}`);
  
    if (
      response?.data?.user.pinStatus == 'ENABLED' &&
      response?.data?.user.securityQuestionStatus == 'ENABLED'
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// move to configs
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "SignIn",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req): Promise<any> {
        if (!credentials) return null;
        const userInfo = await axios.post("/signin", {
          password: credentials?.password,
          email: credentials?.email,
        });
        if (userInfo) {
          // Any object returned will be saved in `user` property of the JWT
          const user = {
            userId: userInfo.data.userId,
            userToken: userInfo.data.userToken,
            encryptionKey: userInfo.data.encryptionKey,
            challengeId: userInfo.data?.challengeId,
          };
          return user;
        } else {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "SignUp",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req): Promise<any> {
        if (!credentials) return null;
        const userInfo = await axios.post("/signup", {
          password: credentials?.password,
          email: credentials?.email,
        });
        if (userInfo) {
          if (userInfo.status === 201) {
            throw Error("This email address has already been used, please sign in");
          }
          // Any object returned will be saved in `user` property of the JWT
          const user = {
            userId: userInfo.data.userId,
            userToken: userInfo.data.userToken,
            encryptionKey: userInfo.data.encryptionKey,
            challengeId: userInfo.data?.challengeId,
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as User;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV !== "production",
};
