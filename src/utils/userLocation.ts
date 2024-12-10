import { getCountriesForTimezone } from 'countries-and-timezones'

import { Currency, PossibleUserCountry } from '@/models/currency'

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * This should ONLY be used client side!!
 * Retrieves the currency based on the country (will be retrieved if not passed in).
 * CAD for Canada, and USD for everyone else.
 */
export function getUserCurrency(country?: PossibleUserCountry): Currency {
  if (country) {
    return country.isCanada ? 'CAD' : 'USD'
  }

  const countries = getCountriesForTimezone(getTimezone())
  const isCanada =
    !!countries.find((c) => c.id === 'CA') &&
    countries.find((c) => c.id === 'US') === undefined
  return isCanada ? 'CAD' : 'USD'
}

/** This should ONLY be used client side!! */
export function getUserCountry(): PossibleUserCountry {
  const timeZone = getTimezone()
  const countries = getCountriesForTimezone(getTimezone())

  if (countries.length === 0) {
    console.error(
      `[getUserCountry] No countries for this timezone! (${timeZone}) Defaulting to US.`
    )
    return {
      isCanada: false,
      isUs: true,
      isInternational: false,
    }
  }

  const isCanada = !!countries.find((c) => c.id === 'CA')
  const isUs = !!countries.find((c) => c.id === 'US')

  return {
    isCanada,
    isUs,
    isInternational: !isCanada && !isUs,
  }
}
