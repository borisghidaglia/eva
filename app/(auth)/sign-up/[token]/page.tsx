import { SignUpForm } from "@/components/auth-forms";
import { getUserEmailFromInvitationToken } from "@/lib/invitation-token";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const maybeEmail = await getUserEmailFromInvitationToken(token);
  const error = maybeEmail instanceof Error ? maybeEmail : undefined;
  const email = maybeEmail instanceof Error ? undefined : maybeEmail;
  return (
    <div className="mx-auto mt-35 w-full max-w-sm">
      <SignUpForm token={token} email={email} error={error?.message} />
    </div>
  );
}
