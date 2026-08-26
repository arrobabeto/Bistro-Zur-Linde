/**
 * Progressive enhancement: `[data-lightbox-trigger]` opens a native <dialog>
 * with the full-size image. Without JS, the trigger is still a button (no-op).
 */
export function initLightbox(root: ParentNode = document): void {
  for (const dialog of root.querySelectorAll<HTMLDialogElement>(
    "[data-lightbox]",
  )) {
    initOne(dialog)
  }
}

function initOne(dialog: HTMLDialogElement): void {
  const img = dialog.querySelector<HTMLImageElement>("[data-lightbox-img]")
  if (!img) return

  const section = dialog.closest("section") ?? document

  section.addEventListener("click", (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest("[data-lightbox-close]")) {
      event.preventDefault()
      dialog.close()
      return
    }

    const trigger = target.closest<HTMLElement>("[data-lightbox-trigger]")
    if (!trigger || !section.contains(trigger)) return

    const thumb = trigger.querySelector("img")
    const src =
      trigger.getAttribute("data-lightbox-src") ||
      thumb?.currentSrc ||
      thumb?.getAttribute("src")
    if (!src) return

    event.preventDefault()
    img.src = src
    img.alt = trigger.getAttribute("data-lightbox-alt") ?? thumb?.alt ?? ""
    dialog.showModal()
  })

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close()
  })
}
