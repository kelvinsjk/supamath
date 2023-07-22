export function generateID(...args: (string|number|boolean)[]): string {
  args = args.map((x)=>(typeof x === 'boolean') ? (x ? 'T' : 'F') : x )
  return `id${args.join('')}`
}