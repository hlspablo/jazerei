export function getFirstTwoNames(input?: string | null): string {
  if (!input) return "Usuário"
  // Remove leading and trailing spaces and then split the string by one or more spaces
  const names = input.trim().split(/\s+/)
  // Get the first two names and join them back into a string
  const firstTwoNames = names.slice(0, 2).join(" ")
  return firstTwoNames
}
