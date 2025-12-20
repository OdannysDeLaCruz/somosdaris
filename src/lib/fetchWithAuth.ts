/**
 * Fetch wrapper that automatically handles token refresh on 401 responses
 *
 * This function:
 * 1. Makes the original request
 * 2. If it receives a 401, attempts to refresh the token
 * 3. If refresh succeeds, retries the original request
 * 4. If refresh fails, returns the 401 response
 */

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    return response.ok
  } catch (error) {
    console.error('Error refreshing token:', error)
    return false
  }
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  // Always include credentials (cookies)
  const requestInit: RequestInit = {
    ...init,
    credentials: 'include',
  }

  // Make the original request
  let response = await fetch(input, requestInit)

  // If we get a 401, try to refresh the token
  if (response.status === 401) {
    // If we're already refreshing, wait for that refresh to complete
    if (isRefreshing && refreshPromise) {
      const refreshSucceeded = await refreshPromise

      if (refreshSucceeded) {
        // Retry the original request with the new token
        response = await fetch(input, requestInit)
      }

      return response
    }

    // Start a new refresh
    isRefreshing = true
    refreshPromise = refreshToken()

    const refreshSucceeded = await refreshPromise

    isRefreshing = false
    refreshPromise = null

    if (refreshSucceeded) {
      // Retry the original request with the new token
      response = await fetch(input, requestInit)
    }
  }

  return response
}
