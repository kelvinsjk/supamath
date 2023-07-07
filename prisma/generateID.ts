export function generateID(...args: (string|number)[]): string {
  return `id${args.join('')}`
}