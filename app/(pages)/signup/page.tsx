import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { authOptions } from "@/app/shared/utils";
import { AuthenticationForm } from "@/app/components";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/wallets");
  }

  return <AuthenticationForm isSignIn={false} />;
}
