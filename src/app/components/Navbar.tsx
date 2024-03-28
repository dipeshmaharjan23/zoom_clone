import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="shadow">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3">
        <Link href="/new-meeting">New Meeting</Link>
        <SignedIn>
          <div className="flex items-center gap-5">
            <UserButton />
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
