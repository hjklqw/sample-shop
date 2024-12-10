export type Currency = 'CAD' | 'USD'

/** One timezone may have several countries, so use these booleans to determine what you want to do. */
export interface PossibleUserCountry {
  isCanada: boolean
  isUs: boolean
  isInternational: boolean
}
