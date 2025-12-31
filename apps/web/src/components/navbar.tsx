import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  links?: NavLink[];
  brand?: string;
  brandHref?: string;
  rightContent?: ReactNode;
}

export function Navbar({
  links = [],
  brand = "ENIGMA",
  brandHref = "/",
  rightContent,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 w-full flex items-center justify-between border-b border-solid border-border bg-background px-4 z-50">
      <div className="absolute left-4">
        <Link
          href={brandHref}
          className="font-medium text-sm hover:opacity-70 transition-opacity"
        >
          {brand}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {links.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3">{rightContent}</div>
    </nav>
  );
}
