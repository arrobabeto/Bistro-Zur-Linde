const SHOW_DELAY_MS = 2000
/** localStorage key — calendar day `YYYY-MM-DD` in the visitor's local timezone. */
export const COOKIE_BANNER_STORAGE_KEY = "bistro-cookie-banner-dismissed-on"
/** First-party cookie backup (same day value). */
export const COOKIE_BANNER_COOKIE_NAME = "bistro_cookie_banner_day"

export function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function secondsUntilEndOfLocalDay(now = new Date()): number {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return Math.max(60, Math.floor((end.getTime() - now.getTime()) / 1000))
}

function readCookie(name: string): string | null {
  try {
    const match = document.cookie.match(
      new RegExp(
        `(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`,
      ),
    )
    const value = match?.[1]
    return value ? decodeURIComponent(value) : null
  } catch {
    return null
  }
}

function writeDayCookie(day: string): void {
  try {
    const maxAge = secondsUntilEndOfLocalDay()
    document.cookie = `${COOKIE_BANNER_COOKIE_NAME}=${encodeURIComponent(day)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  } catch {
    // ignore
  }
}

export function readDismissedDay(): string | null {
  try {
    const fromLs = localStorage.getItem(COOKIE_BANNER_STORAGE_KEY)
    if (fromLs) return fromLs
  } catch {
    // private / blocked
  }
  return readCookie(COOKIE_BANNER_COOKIE_NAME)
}

export function wasDismissedToday(): boolean {
  return readDismissedDay() === todayKey()
}

export function markDismissedToday(): void {
  const day = todayKey()
  try {
    localStorage.setItem(COOKIE_BANNER_STORAGE_KEY, day)
  } catch {
    // private / blocked — cookie still set below
  }
  writeDayCookie(day)
}

export function clearDismissedFlagForTests(): void {
  try {
    localStorage.removeItem(COOKIE_BANNER_STORAGE_KEY)
  } catch {
    // ignore
  }
  try {
    document.cookie = `${COOKIE_BANNER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`
  } catch {
    // ignore
  }
}

export function initCookieBanner(root: ParentNode = document): void {
  const banner = root.querySelector<HTMLElement>("[data-cookie-banner]")
  if (!banner) return

  // Already handled by the inline bootstrap, or dismissed earlier today.
  if (
    document.documentElement.hasAttribute("data-cookie-banner-dismissed") ||
    wasDismissedToday()
  ) {
    banner.remove()
    return
  }

  if (banner.dataset.cookieBannerBound === "1") return
  banner.dataset.cookieBannerBound = "1"

  let dismissed = false

  const show = (): void => {
    if (dismissed || wasDismissedToday()) return
    banner.hidden = false
    banner.setAttribute("aria-hidden", "false")
  }

  const dismiss = (): void => {
    if (dismissed) return
    dismissed = true
    markDismissedToday()
    document.documentElement.setAttribute("data-cookie-banner-dismissed", "1")
    clearTimeout(timer)
    banner.hidden = true
    banner.setAttribute("aria-hidden", "true")
    banner.remove()
  }

  const timer = setTimeout(show, SHOW_DELAY_MS)

  const dismissBtn = banner.querySelector("[data-cookie-banner-dismiss]")
  dismissBtn?.addEventListener("click", dismiss)

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !banner.hidden) dismiss()
  })
}
