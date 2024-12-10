import { Metadata } from 'next'

import { FullPageHeader } from '@/components/pageHeaders/full'
import { SectionHeader } from '@/components/pageHeaders/section'

import styles from './styles.module.scss'

import { ContactIcon } from './icons/ContactIcon'
import { EtsyIcon } from './icons/EtsyIcon'
import { GumroadIcon } from './icons/GumroadIcon'
import { KofiIcon } from './icons/KofiIcon'
import { LinksIcon } from './icons/LinksIcon'
import { ShopIcon } from './icons/ShopIcon'
import { TwitterIcon } from './icons/TwitterIcon'
import { LargeLink } from './largeLink'
import { SafeAndFlexibleIcon } from '@/app/product/[slug]/icons/SafeAndFlexibleIcon'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Everywhere you can find me at for contact or support',
}

export default function LinksPage() {
  return (
    <>
      <FullPageHeader
        text="Links"
        description="Everywhere you can find me at for contact or support"
        icon={
          <LinksIcon
            style={{
              fontSize: '0.8em',
              marginRight: '0.5em',
              strokeWidth: 0.6,
            }}
          />
        }
      />

      <div className={styles.wrapper}>
        <p>
          Because this is a sample site, these links all go back to my
          portfolio.
        </p>

        <SectionHeader text="Other shops" icon={<ShopIcon />} simple />

        <section className={styles.section}>
          <LargeLink
            href="https://michellepoon.ca/portfolio"
            label="Gumroad"
            icon={<GumroadIcon style={{ color: '#ff90e8' }} />}
            description="For digital downloads and resources"
            compact
          />
          <LargeLink
            href="https://michellepoon.ca/portfolio"
            label="Etsy"
            icon={<EtsyIcon style={{ color: '#f56400' }} />}
            description="For physical merchandise such as apparel and home goods"
            compact
          />
        </section>

        <SectionHeader
          text="Updates and contact"
          icon={<ContactIcon style={{ fontSize: '1.15em' }} />}
          simple
        />

        <section className={styles.section}>
          <LargeLink
            href="https://michellepoon.ca/portfolio"
            label="Twitter"
            icon={<TwitterIcon style={{ color: '#179cf0' }} />}
            description="Shop updates and quick announcements"
            compact
          />
        </section>

        <SectionHeader text="Support" icon={<SafeAndFlexibleIcon />} simple />

        <section className={styles.section}>
          <LargeLink
            href="https://michellepoon.ca/portfolio"
            label="Ko-fi"
            icon={<KofiIcon style={{ color: '#ff5e5b', fontSize: '1.15em' }} />}
            description="For donations ♥"
            compact
          />
        </section>
      </div>
    </>
  )
}
