import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'

import { Loader } from '@/components/loader'

import styles from './styles.module.scss'

import { ErrorIcon } from './icons/errorIcon'
import { kofiIcon } from './icons/kofiIcon'
import { MailIcon } from './icons/mailIcon'
import { SendIcon } from './icons/sendIcon'
import { SparklesIcon } from './icons/sparklesIcon'
import { TwitterIcon } from './icons/twitterIcon'

const socialLinks = [
  {
    Icon: TwitterIcon,
    alt: 'Twitter',
    url: '#',
    isExternal: true,
  },
  {
    Icon: kofiIcon,
    alt: 'Ko-fi',
    url: '#',
    isExternal: true,
  },
  {
    Icon: MailIcon,
    alt: 'Email',
    url: 'mailto:mp.hjklqw@gmail.com',
    isExternal: true,
  },
]

export const GlobalFooter = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isSubscribed, setSubscribed] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  const onSubscribeClicked = useCallback(async () => {
    if (!inputRef.current) return

    if (inputRef.current.value === '') {
      setErrorMessage('Enter your email!')
      return
    }

    setLoading(true)

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputRef.current.value.trim(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      setErrorMessage(error)
      setLoading(false)
      return
    }

    inputRef.current.value = ''
    setErrorMessage(undefined)
    setLoading(false)
    setSubscribed(true)
  }, [])

  return (
    <footer>
      <div>
        <section className={styles.mailingList}>
          {isSubscribed ? (
            <div className={styles.subscriptionMessage}>
              <b>Thank you!</b> <SparklesIcon /> Check your inbox to see me
              grovel!
            </div>
          ) : (
            <>
              <span className={styles.message}>
                Join the mailing list to get shop updates, exclusive discounts,
                freebies, and more!
              </span>
              <div
                className={`${styles.controls} ${
                  errorMessage ? styles.error : ''
                }`}
              >
                <div>
                  <input
                    placeholder="Your email"
                    ref={inputRef}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSubscribeClicked()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="animated"
                    onClick={onSubscribeClicked}
                    disabled={isLoading}
                  >
                    <span>Subscribe</span>
                    {isLoading && <Loader className={styles.loader} />}
                    <SendIcon className={styles.mobileSubmitIcon} />
                  </button>
                </div>
                {errorMessage && (
                  <div className={styles.errorMessage}>
                    <ErrorIcon />
                    {errorMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <div className={styles.divider} />

        <section className={styles.social}>
          {socialLinks.map((s, i) => (
            <Link
              key={s.alt}
              href={s.url}
              title={s.alt}
              className="icon"
              target={s.isExternal ? '_blank' : undefined}
              rel="noreferrer"
            >
              <s.Icon />
            </Link>
          ))}
        </section>
      </div>

      <section className={styles.copyright}>© Michelle Poon, 2024</section>
    </footer>
  )
}
