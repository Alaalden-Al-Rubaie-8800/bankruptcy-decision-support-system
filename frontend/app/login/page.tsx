import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.has("access_token")) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-5">
      <LoginForm />
    </main>
  );
}
