export function pct(a: number, b: number): number {
  return b === 0 ? 0 : Math.round((a / b) * 100)
}

export function chunk<T>(xs: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n))
  return out
}
