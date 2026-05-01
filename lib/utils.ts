export function extractTicketNumber(filename: string) {
  const match = filename.match(/\d+/g)
  if (!match) return null
  return match.join("")
}
