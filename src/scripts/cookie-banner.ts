const SHOW_DELAY_MS = 2000

export function initCookieBanner(root: ParentNode = document): void {
  const banner = root.querySelector<HTMLElement>("[data-cookie-banner]")
  if (!banner) return

  let dismissed = false

  const show = (): void => {
    if (dismissed) return
    banner.hidden = false
    banner.setAttribute("aria-hidden", "false")
  }

  const dismiss = (): void => {
    if (dismissed) return
    dismissed = true
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
