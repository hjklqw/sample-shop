/** Return a base className with a bunch of other classes that are conditionally applied. */
export function buildClassNames(
  base: string,
  additional: string | undefined,
  conditional: { [name: string]: boolean }
) {
  const conditionalClasses = Object.entries(conditional)
    .filter(([_name, shouldUse]) => shouldUse)
    .map(([name, _shouldUse]) => name)
  const trueBase = buildClassName(base, additional)
  return [trueBase, ...conditionalClasses].join(' ')
}

/** Return a className with an additional override (usually passed in from props) if it exists */
export function buildClassName(base: string, additional: string | undefined) {
  if (additional) {
    return `${base} ${additional}`
  }
  return base
}
