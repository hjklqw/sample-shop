/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

import styles from './styles.module.scss'

export const FeaturedSection = () => (
  <div className={styles.featuredSection}>
    <Link href={ROUTES.collection('winter-2024')}>
      <div className={styles.bg}>
        <img src="/featured/rays.png" alt="" className={styles.rays} />
        <Image
          src="/featured/title.png"
          alt="Winter 2024 Decorative Collection"
          width={743}
          height={247}
          className={styles.title}
        />
        <Image
          src="/featured/title-mobile.png"
          alt="Winter 2024 Decorative Collection"
          width={499}
          height={206}
          className={styles.titleMobile}
        />
      </div>
    </Link>

    <img src="/featured/tri1.png" alt="" className={styles.tri1} />
    <img src="/featured/tri2.png" alt="" className={styles.tri2} />
    <img src="/featured/tri3.png" alt="" className={styles.tri3} />
    <img src="/featured/tri4.png" alt="" className={styles.tri4} />

    <div className={styles.designs}>
      <div>
        <span>
          Designs<span>5</span>
          <span>6</span>
        </span>
        <div>
          <Image
            src="/featured/gold.png"
            alt="Djeeta"
            width={400}
            height={400}
          />
          <Image
            src="/featured/silver.png"
            alt="Djeeta"
            width={400}
            height={400}
          />
        </div>
      </div>
      <div>
        <span>
          Designs<span>1</span>
          <span>3</span>
        </span>
        <div>
          <Image
            src="/featured/red.png"
            alt="Avatar"
            width={400}
            height={400}
          />
          <Image
            src="/featured/blue.png"
            alt="Avatar"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>

    <div className={styles.totalDesigns}>
      <b>6</b> total designs! View all →
    </div>
  </div>
)
