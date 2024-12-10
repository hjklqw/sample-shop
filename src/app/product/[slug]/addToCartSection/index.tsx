import styles from './styles.module.scss'

import { AddToCartSectionContents, Props } from './contents'

export const AddToCartSection = (props: Props) => {
  if (props.productStock === 0) {
    return (
      <section className={styles.addToCartSection}>
        <button type="button" className={styles.soldOutButton} disabled>
          Sold out!
        </button>
        <p className={styles.restockMessage}>
          If you would like this restocked, feel free to drop me a message
          through email or on Twitter.
        </p>
      </section>
    )
  }
  return <AddToCartSectionContents {...props} />
}
