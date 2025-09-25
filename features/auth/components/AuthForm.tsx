import Heading from "@/components/Heading";
import { Card, CardContent } from "@/components/ui/card";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function AuthCard({ children }: PropsWithChildren) {
  return (
    <div className="space-y-2 bg-[#05162B] py-6 max-w-sm w-full! mx-auto rounded-lg overflow-hidden border border-double border-slate-400 shadow-2xl backdrop-blur-2xl">
      {children}
    </div>
  );
}

// Header Section
function AuthCardHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col text-center space-y-1 px-6">{children}</div>
  );
}

// Main Title
function AuthCardTitle({ children }: PropsWithChildren) {
  return (
    <Heading as="h1" size="h2" weight="bold">
      {children}
    </Heading>
  );
}

// Subtitle (small heading under title)
function AuthCardSubtitle({ children }: PropsWithChildren) {
  return (
    <Heading as="h3" size="h3" weight="medium">
      {children}
    </Heading>
  );
}

// Card Body
function AuthCardContent({ children }: PropsWithChildren) {
  return (
    <Card className="border-0 bg-[#05162B] py-2">
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// Footer Section (links/info)
function AuthCardFooter({ children }: PropsWithChildren) {
  return (
    <div className="flex gap-2 justify-center text-center text-sm">
      {children}
    </div>
  );
}

// Link Component
function AuthCardLink({
  href,
  children,
  className,
  ...props
}: LinkProps & PropsWithChildren & { className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-blue-500 dark:text-blue-400 font-semibold hover:underline underline-offset-2 focus:underline active:underline text-xs",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

// Small text used inside footer or form
function AuthCardText({ children }: PropsWithChildren) {
  return <span className="text-gray-100 font-medium text-xs">{children}</span>;
}

// Attach subcomponents
AuthCard.Header = AuthCardHeader;
AuthCard.Title = AuthCardTitle;
AuthCard.Subtitle = AuthCardSubtitle;
AuthCard.Content = AuthCardContent;
AuthCard.Footer = AuthCardFooter;
AuthCard.Link = AuthCardLink;
AuthCard.Text = AuthCardText;
