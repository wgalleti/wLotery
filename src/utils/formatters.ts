export function padNumber(n: number): string {
  return n.toString().padStart(2, '0')
}

export function formatContestRange(from: number, to: number): string {
  return `#${from.toLocaleString('pt-BR')} → #${to.toLocaleString('pt-BR')}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatDateForExport(): string {
  return new Date().toISOString().split('T')[0] ?? ''
}
