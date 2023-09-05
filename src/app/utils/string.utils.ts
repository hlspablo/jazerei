export function getFirstTwoNames(input?: string | null): string {
  if (!input) return "Usuário"
  const names = input.trim().split(/\s+/)
  const firstTwoNames = names.slice(0, 2).join(" ")
  return firstTwoNames
}
export function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
