import Link from "next/link";
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
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Link
          href={brandHref}
          className="font-bold text-xl tracking-tighter hover:opacity-70 transition-opacity"
        >
          {brand}
        </Link>

        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center gap-3">{rightContent}</div>
      )}
    </nav>
  );
}
