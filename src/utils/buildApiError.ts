import { NextResponse } from 'next/server'

import { ApiError } from '@/models/api/apiResponse'

/**
 * Logs the error and returns it in proper format with a 500 status code.
 * Use this at the end of an API route when catching unknown errors.
 */
export function buildApiError(error: any, extraDetails?: string) {
  console.error(error)
  return NextResponse.json<ApiError>(
    { error, isUserError: false, extraDetails },
    { status: 500 }
  )
}
