'use client'

import { Menu, Waypoints, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { navItems } from './nav'
import Image from 'next/image'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="mt-8 flex flex-col gap-3 px-5">
      {navItems.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'group flex items-center gap-4 rounded-2xl px-5 py-3 text-[15px] font-medium transition-all duration-200',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground hover:translate-x-1',
            )}
          >
            <Icon
              className={cn(
               'size-[18px] transition-all duration-200',
                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
              )}
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 pt-10 pb-8 text-center">

  <Image
  src="/logo.png"
  alt="NeuroTrace Logo"
  width={64}
  height={64}
  className="rounded-full shrink-0"
/>

  <div className="leading-tight">
  <p className="text-2xl font-bold tracking-tight">
    NeuroTrace
  </p>

  <p className="text-sm text-muted-foreground/80">
    Behavioral Analytics
  </p>
</div>

</div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm lg:flex">
        <Brand />
        <NavLinks />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[290px] flex-col border-r border-sidebar-border bg-sidebar shadow-xl">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
  <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    onClick={() => setOpen(true)}
    aria-label="Open navigation"
  >
    <Menu className="size-5" />
  </Button>

  <div className="flex-1">
  <p className="text-sm text-muted-foreground">
    {new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}{' '}
    · <span className="text-foreground">Today</span>
  </p>
</div>

  <ThemeToggle />
</header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
