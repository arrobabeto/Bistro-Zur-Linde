const SHOW_DELAY_MS = 2000
const STORAGE_KEY = "bistro-cookie-banner-dismissed-on"

function todayKey(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function wasDismissedToday(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === todayKey()
  } catch {
    return false
  }
}

function markDismissedToday(): void {
  try {
    localStorage.setItem(STORAGE_KEY, todayKey())
  } catch {
    // private mode / blocked storage — keep in-memory dismiss only
  }
}

export function initCookieBanner(root: ParentNode = document): void {
  const banner = root.querySelector<HTMLElement>("[data-cookie-banner]")
  if (!banner) return

  if (wasDismissedToday()) return

  let dismissed = false

  const show = (): void => {
    if (dismissed) return
    banner.hidden = false
    banner.setAttribute("aria-hidden", "false")
  }

  const dismiss = (): void => {
    if (dismissed) return
    dismissed = true
    markDismissedToday()
    clearTimeout(timer)
    banner.hidden = true
    banner.setAttribute("aria-hidden", "true")
  }

  const timer = setTimeout(show, SHOW_DELAY_MS)

  const dismissBtn = banner.querySelector("[data-cookie-banner-dismiss]")
  dismissBtn?.addEventListener("click", dismiss)

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !banner.hidden) dismiss()
  })
}
