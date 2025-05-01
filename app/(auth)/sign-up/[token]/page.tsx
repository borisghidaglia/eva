import { SignUpForm } from "@/components/auth-forms";
import { getUserEmailFromInvitationToken } from "@/lib/invitation-token";

export default async function SignUpPage({
  params,
}: {
  params: { token: string };
}) {
  // Throws an error if not awaited
  // https://nextjs.org/docs/messages/sync-dynamic-apis
  const { token } = await params;
  const email = await getUserEmailFromInvitationToken(token);
  return (
    <div className="mx-auto mt-35 w-full max-w-sm">
      <SignUpForm
        token={token}
        email={email.ok ? email.value : ""}
        error={email.ok ? undefined : email.error.message}
      />
    </div>
  );
}
