import { getSite } from '@/lib/data'
import { cn } from '@/lib/utils'

export function SiteIcon({
  domain,
  className,
  size = 36,
}: {
  domain: string
  className?: string
  size?: number
}) {
  const site = getSite(domain)
  const letter = site.name.charAt(0).toUpperCase()
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg font-semibold text-white shadow-sm ring-1 ring-black/10',
        className,
      )}
      style={{
        backgroundColor: site.tone,
        width: size,
        height: size,
        fontSize: size * 0.42,
      }}
      aria-hidden="true"
    >
      {letter}
    </span>
  )
}
