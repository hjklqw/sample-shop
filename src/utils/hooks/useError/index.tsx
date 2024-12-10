import { ApiResponse } from '@/models/api/apiResponse'

import { ErrorIcon } from '@/components/layouts/global/icons/errorIcon'

import styles from './styles.module.scss'

export function useApiError(res: ApiResponse<any>, noWrapper?: boolean) {
  const error = useError(
    res.error || (!res.data ? 'An unknown error occurred!' : ''),
    noWrapper,
    !res.isUserError
  )
  return error
}

export function useError(
  error: string | undefined | null,
  noWrapper?: boolean,
  addSoundsWeirdLine?: boolean
) {
  if (error) {
    return (
      <div className={`${styles.error} ${noWrapper ? styles.noWrapper : ''}`}>
        <ErrorIcon />
        <div>
          <p>{error}</p>
          {addSoundsWeirdLine && (
            <p className={styles.soundsWeirdLine}>
              If this error sounds weird, please send it to me with context.
            </p>
          )}
        </div>
      </div>
    )
  }

  return null
}
