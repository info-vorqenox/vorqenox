"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { SiteSettings } from "@/lib/data"

export function Footer({ settings }: { settings?: SiteSettings | null }) {
  const [year, setYear] = useState<number | null>(null)
  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const linkedinUrl = settings?.socialLinks?.linkedin

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                <span className="text-xs font-bold neon-text">V</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                Vorqe<span className="neon-text">nox</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The ultimate destination for premium apps, games, AI tools, and
              exclusive digital offers.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Contact
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:Vorqenox@gmail.com"
                className="text-sm text-primary transition-opacity hover:opacity-80"
              >
                Vorqenox@gmail.com
              </a>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {year ? `\u00A9 ${year} Vorqenox. All rights reserved.` : "\u00A9 Vorqenox. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
