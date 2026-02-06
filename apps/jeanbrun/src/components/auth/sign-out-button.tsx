"use client";

import { Button } from "@/components/ui/button";
import { useSignOut } from "@/hooks/use-sign-out";
import { useSession } from "@/lib/auth-client";

export function SignOutButton() {
  const { data: session, isPending } = useSession();
  const { signOut } = useSignOut();

  if (isPending) {
    return <Button disabled>Loading...</Button>;
  }

  if (!session) {
    return null;
  }

  return (
    <Button variant="outline" onClick={signOut}>
      Sign out
    </Button>
  );
}
