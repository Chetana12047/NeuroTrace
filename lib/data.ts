export type Category = 'productive' | 'distracting' | 'neutral'

export const categoryMeta: Record<
  Category,
  { label: string; color: string; chart: string }
> = {
  productive: {
    label: 'Productive',
    color: 'var(--success)',
    chart: 'var(--chart-1)',
  },
  distracting: {
    label: 'Distracting',
    color: 'var(--destructive)',
    chart: 'var(--chart-4)',
  },
  neutral: {
    label: 'Neutral',
    color: 'var(--warning)',
    chart: 'var(--chart-3)',
  },
}

export type Site = {
  domain: string
  name: string
  category: Category
  /** background color for the generated icon */
  tone: string
}

export const sites: Record<string, Site> = {
  'github.com': { domain: 'github.com', name: 'GitHub', category: 'productive', tone: '#1f2328' },
  'vercel.com': { domain: 'vercel.com', name: 'Vercel', category: 'productive', tone: '#111827' },
  'figma.com': { domain: 'figma.com', name: 'Figma', category: 'productive', tone: '#a259ff' },
  'notion.so': { domain: 'notion.so', name: 'Notion', category: 'productive', tone: '#2f2f2f' },
  'linear.app': { domain: 'linear.app', name: 'Linear', category: 'productive', tone: '#5e6ad2' },
  'stackoverflow.com': { domain: 'stackoverflow.com', name: 'Stack Overflow', category: 'productive', tone: '#f48024' },
  'docs.google.com': { domain: 'docs.google.com', name: 'Google Docs', category: 'productive', tone: '#1a73e8' },
  'gmail.com': { domain: 'gmail.com', name: 'Gmail', category: 'neutral', tone: '#ea4335' },
  'slack.com': { domain: 'slack.com', name: 'Slack', category: 'neutral', tone: '#4a154b' },
  'calendar.google.com': { domain: 'calendar.google.com', name: 'Calendar', category: 'neutral', tone: '#1a73e8' },
  'youtube.com': { domain: 'youtube.com', name: 'YouTube', category: 'neutral', tone: '#4a154b' },
  'instagram.com': { domain: 'instagram.com', name: 'Instagram', category: 'distracting', tone: '#e1306c' },
  'twitter.com': { domain: 'twitter.com', name: 'X (Twitter)', category: 'distracting', tone: '#1d1d1f' },
  'reddit.com': { domain: 'reddit.com', name: 'Reddit', category: 'distracting', tone: '#ff4500' },
  'netflix.com': { domain: 'netflix.com', name: 'Netflix', category: 'distracting', tone: '#e50914' },
  'linkedin.com': { domain: 'linkedin.com', name: 'Linkedin', category: 'productive', tone: '#1f2328' },
}

export function getSite(domain: string): Site {
  return (
    sites[domain] ?? {
      domain,
      name: domain.replace(/^www\./, ''),
      category: 'neutral',
      tone: '#64748b',
    }
  )
}

/* ----------------------------- Overview ----------------------------- */

export const overviewStats = {
  focusScore: 78,
  focusScoreDelta: 6,
  productiveTime: '5h 12m',
  productiveDelta: 8,
  distractingTime: '1h 47m',
  distractingDelta: -12,
  deepWork: '2h 38m',
  deepWorkDelta: 14,
  activeHours: '7h 04m',
  activeDelta: 3,
  topSite: 'github.com',
  topSiteTime: '2h 21m',
}

export const dailyActivity = [
  { label: 'Productive', value: 312, category: 'productive' as Category },
  { label: 'Neutral', value: 105, category: 'neutral' as Category },
  { label: 'Distracting', value: 107, category: 'distracting' as Category },
]

export const productiveSplit = [
  { name: 'Productive', value: 312, fill: 'var(--chart-1)' },
  { name: 'Neutral', value: 105, fill: 'var(--chart-3)' },
  { name: 'Distracting', value: 107, fill: 'var(--chart-4)' },
]

export const weeklyTrend = [
  { day: 'Mon', productive: 248, distracting: 96, focus: 71 },
  { day: 'Tue', productive: 286, distracting: 74, focus: 78 },
  { day: 'Wed', productive: 204, distracting: 132, focus: 62 },
  { day: 'Thu', productive: 322, distracting: 68, focus: 83 },
  { day: 'Fri', productive: 312, distracting: 107, focus: 78 },
  { day: 'Sat', productive: 142, distracting: 168, focus: 49 },
  { day: 'Sun', productive: 96, distracting: 118, focus: 44 },
]

/** Focus consistency through the working day (0-100) */
export const focusConsistency = [
  { time: '8 AM', focus: 52 },
  { time: '9 AM', focus: 84 },
  { time: '10 AM', focus: 91 },
  { time: '11 AM', focus: 88 },
  { time: '12 PM', focus: 61 },
  { time: '1 PM', focus: 47 },
  { time: '2 PM', focus: 73 },
  { time: '3 PM', focus: 80 },
  { time: '4 PM', focus: 69 },
  { time: '5 PM', focus: 58 },
  { time: '6 PM', focus: 44 },
]

/* ----------------------------- Timeline ----------------------------- */

export type TimelineEntry = {
  time: string
  domain: string
  duration: string
  durationMin: number
  title: string
}

export const timeline: TimelineEntry[] = [
  { time: '8:18 AM', domain: 'gmail.com', duration: '6m', durationMin: 6, title: 'Inbox — clearing morning email' },
  { time: '8:24 AM', domain: 'calendar.google.com', duration: '4m', durationMin: 4, title: 'Reviewing today\u2019s schedule' },
  { time: '8:28 AM', domain: 'linear.app', duration: '12m', durationMin: 12, title: 'Sprint board — triaging issues' },
  { time: '8:40 AM', domain: 'github.com', duration: '38m', durationMin: 38, title: 'Pull request review — auth refactor' },
  { time: '9:18 AM', domain: 'instagram.com', duration: '7m', durationMin: 7, title: 'Feed scroll' },
  { time: '9:25 AM', domain: 'github.com', duration: '44m', durationMin: 44, title: 'Deep work — feature branch' },
  { time: '10:09 AM', domain: 'stackoverflow.com', duration: '9m', durationMin: 9, title: 'Debugging hydration error' },
  { time: '10:18 AM', domain: 'github.com', duration: '52m', durationMin: 52, title: 'Deep work — implementing fix' },
  { time: '11:10 AM', domain: 'slack.com', duration: '14m', durationMin: 14, title: 'Team standup thread' },
  { time: '11:24 AM', domain: 'figma.com', duration: '33m', durationMin: 33, title: 'Reviewing dashboard mockups' },
  { time: '11:57 AM', domain: 'youtube.com', duration: '18m', durationMin: 18, title: 'Tech talk — lunch break' },
  { time: '12:15 PM', domain: 'netflix.com', duration: '22m', durationMin: 22, title: 'Episode — lunch break' },
  { time: '1:02 PM', domain: 'notion.so', duration: '26m', durationMin: 26, title: 'Writing spec for analytics page' },
  { time: '1:28 PM', domain: 'twitter.com', duration: '11m', durationMin: 11, title: 'Timeline browsing' },
  { time: '1:39 PM', domain: 'docs.google.com', duration: '41m', durationMin: 41, title: 'Drafting product brief' },
  { time: '2:20 PM', domain: 'github.com', duration: '47m', durationMin: 47, title: 'Deep work — code review fixes' },
  { time: '3:07 PM', domain: 'reddit.com', duration: '13m', durationMin: 13, title: 'r/webdev browsing' },
  { time: '3:20 PM', domain: 'vercel.com', duration: '29m', durationMin: 29, title: 'Checking deployment logs' },
  { time: '3:49 PM', domain: 'figma.com', duration: '24m', durationMin: 24, title: 'Polishing component states' },
  { time: '4:13 PM', domain: 'gmail.com', duration: '8m', durationMin: 8, title: 'Replying to stakeholders' },
]

/* ----------------------------- Focus Analytics ----------------------------- */

/** tab switches per hour */
export const tabSwitches = [
  { time: '8 AM', switches: 14 },
  { time: '9 AM', switches: 22 },
  { time: '10 AM', switches: 9 },
  { time: '11 AM', switches: 18 },
  { time: '12 PM', switches: 31 },
  { time: '1 PM', switches: 27 },
  { time: '2 PM', switches: 11 },
  { time: '3 PM', switches: 24 },
  { time: '4 PM', switches: 16 },
  { time: '5 PM', switches: 21 },
]

/** distraction spikes (count of distracting visits per hour) */
export const distractionSpikes = [
  { time: '8 AM', spikes: 1 },
  { time: '9 AM', spikes: 2 },
  { time: '10 AM', spikes: 0 },
  { time: '11 AM', spikes: 1 },
  { time: '12 PM', spikes: 5 },
  { time: '1 PM', spikes: 4 },
  { time: '2 PM', spikes: 0 },
  { time: '3 PM', spikes: 3 },
  { time: '4 PM', spikes: 1 },
  { time: '5 PM', spikes: 2 },
]

export const focusStats = {
  longestSession: '52m',
  longestSessionApp: 'github.com',
  avgSession: '21m',
  fragmentation: 'Low',
  peakHours: '9 AM – 11 AM',
  continuousSessions: 6,
}

/** hours of day x days of week productivity intensity (0-100) */
export const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const heatmapHours = ['8', '9', '10', '11', '12', '1', '2', '3', '4', '5']
export const heatmap: number[][] = [
  [40, 78, 88, 82, 55, 38, 64, 72, 60, 48],
  [52, 84, 90, 86, 60, 44, 70, 76, 66, 52],
  [36, 70, 80, 74, 48, 30, 58, 66, 54, 40],
  [58, 88, 94, 90, 64, 50, 74, 80, 70, 58],
  [50, 82, 89, 85, 58, 42, 68, 78, 64, 50],
]

/* ----------------------------- AI Insights ----------------------------- */

export type Insight = {
  kind: 'observation' | 'recommendation' | 'tip' | 'distraction'
  title: string
  body: string
}

export const insights: Insight[] = [
  {
    kind: 'observation',
    title: 'Your productivity peaks between 9 AM and 11 AM',
    body: 'Across the past week, focus scores in this window averaged 88%. Consider scheduling your most demanding work here.',
  },
  {
    kind: 'distraction',
    title: 'Frequent short visits to social media reduced focus consistency',
    body: 'Instagram and X accounted for 18 brief visits today, most clustered around midday — fragmenting an otherwise strong morning.',
  },
  {
    kind: 'observation',
    title: 'Deep work sessions improved compared to yesterday',
    body: 'You completed 6 uninterrupted sessions over 20 minutes, up from 4. Your longest stretch reached 52 minutes on GitHub.',
  },
  {
    kind: 'tip',
    title: 'The post-lunch dip is predictable',
    body: 'Focus drops to ~47% around 1 PM. A short walk or batching low-effort tasks here tends to protect your afternoon.',
  },
]

export const recommendations = [
  'Block 9:00–11:00 AM as a no-meeting deep work window.',
  'Move social and news sites behind a 1-minute delay during work hours.',
  'Batch Slack and email into two checkpoints rather than continuous monitoring.',
  'Schedule lighter, administrative tasks during the 1 PM focus dip.',
]

/* ----------------------------- Weekly Analytics ----------------------------- */

export const weeklyStats = {
  totalActive: '38h 12m',
  totalActiveDelta: 5,
  deepWorkTotal: '14h 26m',
  deepWorkDelta: 11,
  avgFocus: 66,
  avgFocusDelta: 4,
  consistency: 72,
  consistencyDelta: -3,
}

export const weeklyConsistency = [
  { day: 'Mon', consistency: 74 },
  { day: 'Tue', consistency: 81 },
  { day: 'Wed', consistency: 63 },
  { day: 'Thu', consistency: 86 },
  { day: 'Fri', consistency: 78 },
  { day: 'Sat', consistency: 52 },
  { day: 'Sun', consistency: 47 },
]

export const topSitesWeek = [
  { domain: 'github.com', time: '11h 42m', minutes: 702 },
  { domain: 'figma.com', time: '4h 18m', minutes: 258 },
  { domain: 'notion.so', time: '3h 26m', minutes: 206 },
  { domain: 'youtube.com', time: '2h 51m', minutes: 171 },
  { domain: 'slack.com', time: '2h 12m', minutes: 132 },
  { domain: 'instagram.com', time: '1h 38m', minutes: 98 },
]

/* ----------------------------- Popup ----------------------------- */

export const popupStats = {
  focusScore: 78,
  productiveTime: '5h 12m',
  distractingTime: '1h 47m',
  currentSite: 'github.com',
  currentTitle: 'pull request — auth refactor',
  tabSwitches: 142,
  deepWork: '2h 38m',
}
