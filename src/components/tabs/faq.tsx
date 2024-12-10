import { ProductFaqEntry } from '@/models/db/product'
import { QuestionIcon } from './icons/QuestionIcon'
import styles from './styles.module.scss'

type Props = {
  faq: ProductFaqEntry[]
}

export const FaqTab = ({ faq }: Props) => (
  <section className={styles.faqSection}>
    {faq.map((entry, i) => (
      <div key={i} className={styles.faqEntry}>
        <p className={styles.question}>
          <QuestionIcon />
          {entry.question}
        </p>
        <p className={styles.answer}>{entry.answer}</p>
      </div>
    ))}
  </section>
)
