"use client";

import { useSession } from "next-auth/react";
import LinkButton, { LinkButtonProps } from "../ui/link-button";

type Props = {
  logInButton: LinkButtonProps;
  signUpButton: LinkButtonProps;
};

export type AuthContainerProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const AccessPortalContainer = (props: AuthContainerProps) => {
  const isLoading = false;
  const session = useSession();
  let error = null;
  if (!session.data?.user) {
    error = new Error("User not found");
  }
  const user = session.data?.user;
  const { logInButton, signUpButton } = {
    ...AuthContainerDefaults,
    ...props,
  };

  if (isLoading)
    return <div className="text-center text-zinc-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">{error.message}</div>;

  if (user) {
    return (
      <div className="mt-6">
        <LinkButton
          navLink={{
            title: "Go to Dashboard",
            url: "/app/overview",
            follow: false,
          }}
          variant="primary"
          size="xl"
          className="w-full py-3 rounded-lg text-lg font-semibold"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 mt-6">
      <LinkButton
        {...logInButton}
        className="w-full py-3 rounded-lg text-lg font-semibold"
      />
      <LinkButton
        {...signUpButton}
        className="w-full py-3 rounded-lg text-lg font-semibold"
      />
    </div>
  );
};

export const AuthContainerDefaults: Props = {
  logInButton: {
    navLink: { title: "Login", url: "/api/auth/login", follow: false },
    variant: "default",
    size: "xl",
  },
  signUpButton: {
    navLink: {
      title: "Create Account",
      url: "/api/auth/signup",
      follow: false,
    },
    variant: "secondary",
    size: "xl",
  },
};
