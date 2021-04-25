const cachedSelect = new Map()

export function select(selector, callback) {
  let el = cachedSelect.get(selector)
  if (!el) {
    el = document.querySelector(selector)
    cachedSelect.set(selector, el)
  }
  callback(el)
}
