import { authOptions, validOnboardStatus } from "@/app/shared/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isValidOnboardStatus = session
    ? await validOnboardStatus(session)
    : false;

  if (!session || !isValidOnboardStatus) {
    redirect("/signin");
  }

  return <>{children}</>;
}
