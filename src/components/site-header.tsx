"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ui/mode-toggle";

export function SiteHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:rounded-md"
      >
        Skip to main content
      </a>
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-40" role="banner">
        <nav
          className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-6 sm:gap-10">
            <h1 className="text-xl sm:text-2xl font-bold">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                aria-label="PagePilot DZ - Go to homepage"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10"
                  aria-hidden="true"
                >
                  <Compass className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  PagePilot DZ
                </span>
              </Link>
            </h1>

            {/* Navigation links visible only when authenticated */}
            {session && (
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors hover:text-foreground hover:bg-accent/50",
                    pathname === "/dashboard" && "text-foreground bg-accent font-semibold"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/library"
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors hover:text-foreground hover:bg-accent/50",
                    pathname === "/library" && "text-foreground bg-accent font-semibold"
                  )}
                >
                  Library
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4" role="group" aria-label="User actions">
            {/* Mobile navigation links (simpler inline display for MVP) */}
            {session && (
              <div className="flex md:hidden items-center gap-1 mr-2 text-xs font-medium text-muted-foreground">
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-2 py-1 rounded-md transition-colors",
                    pathname === "/dashboard" && "text-foreground bg-accent font-semibold"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/library"
                  className={cn(
                    "px-2 py-1 rounded-md transition-colors",
                    pathname === "/library" && "text-foreground bg-accent font-semibold"
                  )}
                >
                  Library
                </Link>
              </div>
            )}
            <UserProfile />
            <ModeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}

