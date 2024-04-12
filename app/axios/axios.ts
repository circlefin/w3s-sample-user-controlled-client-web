import ax, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const axios = ax.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080",
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
