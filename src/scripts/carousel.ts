/**
 * Progressive enhancement for scroll-snap carousels.
 *
 * The track scrolls and the dots navigate as plain anchors without this file,
 * so nothing here is required for the section to work. The arrows stay hidden
 * until `carousel-ready` is set, because arrows that do nothing would be a lie.
 */
export function initCarousels(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-carousel]")) {
    initCarousel(el)
  }
}

function initCarousel(carousel: HTMLElement): void {
  const track = carousel.querySelector<HTMLElement>("[data-carousel-track]")
  const prev = carousel.querySelector<HTMLButtonElement>("[data-carousel-prev]")
  const next = carousel.querySelector<HTMLButtonElement>("[data-carousel-next]")
  if (!track || !prev || !next) return

  const slides = Array.from(track.children) as HTMLElement[]
  const dots = Array.from(
    carousel.querySelectorAll<HTMLAnchorElement>("[data-carousel-dot]"),
  )
  const first = slides[0]
  if (!first || slides.length < 2) return

  const origin = first.offsetLeft

  const currentIndex = (): number => {
    const target = track.scrollLeft + origin
    let closest = 0
    let shortest = Infinity
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - target)
      if (distance < shortest) {
        shortest = distance
        closest = index
      }
    })
    return closest
  }

  const goTo = (index: number): void => {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1)
    const slide = slides[clamped]
    if (!slide) return
    track.scrollTo({
      left: slide.offsetLeft - origin,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }

  const sync = (): void => {
    const index = currentIndex()
    prev.disabled = index === 0
    next.disabled = index === slides.length - 1
    dots.forEach((dot, position) => {
      dot.setAttribute("aria-current", String(position === index))
    })
  }

  prev.addEventListener("click", () => goTo(currentIndex() - 1))
  next.addEventListener("click", () => goTo(currentIndex() + 1))

  dots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault()
      goTo(index)
    })
  })

  let frame = 0
  track.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    },
    { passive: true },
  )

  carousel.classList.add("carousel-ready")
  sync()
}
