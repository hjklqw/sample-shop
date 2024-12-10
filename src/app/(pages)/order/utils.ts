export function getUsedSharedSlots(query: string[]) {
  // The value should be a number, but because we're just stringifying this back to the API it doesn't matter
  const usedSharedSlots: { [slotId: string]: string } = {}

  return query.reduce((res, q) => {
    const [id, amount] = q.split('.')
    return {
      ...res,
      [id]: amount,
    }
  }, usedSharedSlots)
}
