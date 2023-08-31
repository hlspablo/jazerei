export function sleepFor(milliseconds = 100) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
