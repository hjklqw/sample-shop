export const minAmountLeftBeforeMessage = 5

type Props = {
  amountLeft: number
  type?: string
  className?: string
}

/** Shows an "only X left!" message if the amountLeft satisfies the conditions */
export const AmountLeftMessage = ({ amountLeft, type, className }: Props) => {
  if (amountLeft === -1 || amountLeft > minAmountLeftBeforeMessage) return null

  if (amountLeft === 0) {
    return <span className={className}>Sold out!</span>
  }

  const typeStr = type ? (amountLeft === 1 ? ` ${type}` : ` ${type}s`) : ''
  return (
    <span className={className}>
      Only {amountLeft}
      {typeStr} left!
    </span>
  )
}
