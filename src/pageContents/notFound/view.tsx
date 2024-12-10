import Image from 'next/image'

import image404 from './404.png'
import styles from './styles.module.scss'

export const NotFoundPage = () => {
  return (
    <div id={styles.pageWrapper}>
      <h1>404</h1>
      <p>
        This page doesn&apos;t exist!
        <br />
        If you were linked here, please let me know ASAP.
      </p>
      <Image
        src={image404}
        width="505"
        height="237"
        layout="intrinsic"
        alt="Cheese"
      />
    </div>
  )
}
