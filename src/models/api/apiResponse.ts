/** Use this in API routes */
export type ApiError = {
  error: string
  /** Means that the error occurred because the user did something wrong, so it won't be a weird message */
  isUserError: boolean
  /** Any extra details I want to manually provide */
  extraDetails?: string
}

/**
 * Used on the client side.
 * This is the response that comes from the `fetchApi` and `postApi` calls, NOT directly from the API itself.
 * API routes return either `T`, or { error: string }.
 */
export type ApiResponse<T> = Partial<ApiError> & {
  data?: T
}
