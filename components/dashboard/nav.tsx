import {
  Activity,
  Brain,
  CalendarRange,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'

export const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/timeline', label: 'Activity Timeline', icon: Activity },
  { href: '/focus', label: 'Focus Analytics', icon: Brain },
  { href: '/insights', label: 'AI Insights', icon: Sparkles },
  { href: '/weekly', label: 'Weekly Analytics', icon: CalendarRange },
] as const
