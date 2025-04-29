import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="mx-auto mt-35 w-full max-w-sm">
      <LoginForm type="new-password" />
    </div>
  );
}
