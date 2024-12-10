import { ApiResponse } from '@/models/api/apiResponse'

const isDevelopment = process.env.NODE_ENV === 'development'
const devCacheOptions: RequestInit = { cache: 'no-cache' }

const headers = new Headers()
headers.append('Cache-Control', 'max-age=3600')

export async function fetchApi<T>(
  route: string,
  dataName: string,
  prodCacheOptions?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST!}${route}`,
      isDevelopment
        ? { ...devCacheOptions, headers }
        : { ...prodCacheOptions, headers }
    )
    if (!res.ok) {
      return { error: `Failed to fetch ${dataName} data` }
    }
    const json = await res.json()
    if (json.error) {
      return { error: json.error, isUserError: json.isUserError }
    }
    return {
      data: json as T,
    }
  } catch (error: any) {
    return {
      error: `[Internal server error] Failed to fetch ${dataName} data: ${error}`,
    }
  }
}

export async function postApi<T>(
  route: string,
  body: any
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST!}${route}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      return { error: `Failed to post to ${route}` }
    }
    const json = await res.json()
    return { data: json as T }
  } catch (error) {
    return {
      error: `[Internal server error] Failed to post to ${route}: ${error}`,
    }
  }
}
