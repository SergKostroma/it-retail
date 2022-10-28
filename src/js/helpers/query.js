export const qs = (s, container = document) => {
  return container.querySelector(s)
}

export const qsa = (s, container = document) => {
  return container.querySelectorAll(s)
}