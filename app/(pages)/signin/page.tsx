import { authOptions } from "@/app/shared/utils";
import { AuthenticationForm } from "../../components/Authentication/AuthenticationForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/wallets");
  }

  return <AuthenticationForm />;
}
