"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const destinations = [
  { href: "/dashboard", label: "Science dashboard", shortLabel: "Dashboard" },
  { href: "/experiments", label: "Evidence explorer", shortLabel: "Evidence" },
  { href: "/applicability", label: "Applicability", shortLabel: "Applicability" },
  { href: "/recommend/investigations", label: "Investigation ranking", shortLabel: "Rankings" },
  { href: "/mission-control", label: "Mission Control", shortLabel: "Mission Control" },
];

export function MissionNav() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <nav className="mission-nav" aria-label="Primary navigation">
      <Link href="/" className="mission-nav__brand" aria-current={pathname === "/" ? "page" : undefined}>
        <span className="mission-nav__mark" aria-hidden="true">G</span>
        <span>GRAVIFIRE</span>
        <span className="mission-nav__division">RESEARCH SYSTEMS</span>
      </Link>
      <div className="mission-nav__desktop-links">
        {destinations.map((destination) => {
          const active = pathname === destination.href || pathname.startsWith(`${destination.href}/`);
          return <Link key={destination.href} href={destination.href} aria-current={active ? "page" : undefined}>{destination.label}</Link>;
        })}
      </div>
      <details className="mission-nav__menu" ref={menuRef}>
        <summary>Menu</summary>
        <div className="mission-nav__links">
          {destinations.map((destination) => {
            const active = pathname === destination.href || pathname.startsWith(`${destination.href}/`);
            return (
              <Link
                key={destination.href}
                href={destination.href}
                aria-current={active ? "page" : undefined}
                onClick={closeMobileMenu}
              >
                <span className="mission-nav__link-wide">{destination.label}</span>
                <span className="mission-nav__link-compact">{destination.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
