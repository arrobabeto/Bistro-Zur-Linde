/**
 * Progressive enhancement: reservation CTAs open a native <dialog>
 * with the OpenTable embed. Without JS, `#reservieren` still scrolls here.
 */
import { OPENTABLE_LOADER_URL, RESERVATION_HASH } from "~/config/opentable"

const LABELS = ["Tisch reservieren", "Jetzt reservieren", "Book now"] as const

function linkLabel(link: HTMLAnchorElement): string {
  return (link.textContent ?? "")
    .replace(/\s+/g, " ")
    .replace(/[→←]\s*$/u, "")
    .trim()
}

export function initReservationDialog(root: ParentNode = document): void {
  const dialog = root.querySelector<HTMLDialogElement>(
    `[data-reservation-dialog]#${RESERVATION_HASH}`,
  )
  if (!dialog) return

  const mount = dialog.querySelector<HTMLElement>("[data-opentable-mount]")
  if (!mount) return

  let loaded = false

  const loadWidget = (): void => {
    if (loaded) return
    loaded = true
    const script = document.createElement("script")
    script.src = OPENTABLE_LOADER_URL
    script.async = true
    mount.appendChild(script)
  }

  const open = (): void => {
    if (!dialog.open) {
      dialog.showModal()
      loadWidget()
    }
  }

  const close = (): void => {
    if (dialog.open) dialog.close()
  }

  document.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const closeBtn = target.closest("[data-reservation-close]")
    if (closeBtn && dialog.contains(closeBtn)) {
      event.preventDefault()
      close()
      if (location.hash === `#${RESERVATION_HASH}`) {
        history.replaceState(null, "", location.pathname + location.search)
      }
      return
    }

    const link = target.closest("a")
    if (!link || !(link instanceof HTMLAnchorElement)) return

    const href = link.getAttribute("href") ?? ""
    const label = linkLabel(link)
    const isHash =
      href === `#${RESERVATION_HASH}` || href.endsWith(`/#${RESERVATION_HASH}`)
    const isReserveLabel = (LABELS as readonly string[]).includes(label)

    if (!isHash && !isReserveLabel) return

    event.preventDefault()
    open()
    if (location.hash !== `#${RESERVATION_HASH}`) {
      history.replaceState(null, "", `#${RESERVATION_HASH}`)
    }
  })

  dialog.addEventListener("close", () => {
    if (location.hash === `#${RESERVATION_HASH}`) {
      history.replaceState(null, "", location.pathname + location.search)
    }
  })

  if (location.hash === `#${RESERVATION_HASH}`) {
    open()
  }
}
