export function enableMasonry(root: HTMLElement): () => void {
  if (typeof ResizeObserver === 'undefined') return () => {}
  const cards = Array.from(root.children) as HTMLElement[]
  const rowHeight = 8
  function update() {
    const spans = cards.map((card) =>
      Math.max(
        1,
        Math.ceil(
          (card.getBoundingClientRect().height +
            (parseFloat(getComputedStyle(card).marginBottom) || 0)) /
            rowHeight,
        ),
      ),
    )
    cards.forEach((card, index) => {
      card.style.gridRowEnd = `span ${spans[index]}`
    })
  }
  // Grid preserves each card's position when its content changes; CSS columns rebalance it.
  root.style.gridAutoRows = `${rowHeight}px`
  update()
  const observer = new ResizeObserver(update)
  cards.forEach((card) => observer.observe(card))
  return () => observer.disconnect()
}
