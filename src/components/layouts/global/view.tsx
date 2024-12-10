'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { ROUTES } from '@/constants/routes'

import { BackToTopButton } from '@/components/backToTop'
import { ShopName } from '@/components/shopName'

import styles from './styles.module.scss'

import { HeaderCartButton } from './cartButton'
import { GlobalFooter } from './footer'
import { MenuIcon } from './icons/menuIcon'

type Props = {
  children: React.ReactNode
}

const globalNav: { label: string; route: string }[] = [
  { label: 'Products', route: ROUTES.products },
  { label: 'Collections', route: ROUTES.collections },
  { label: 'Links', route: ROUTES.links },
]

export const GlobalLayout = ({ children }: Props) => {
  const [isNavOpen, setNavOpen] = useState<boolean>(false)

  return (
    <div className={styles.globalLayout} id="scrollRoot">
      <header>
        <section className={styles.topBar}>
          <div className={styles.headerContents}>
            <Link href={ROUTES.home} title="Home" className={styles.shopName}>
              <ShopName />
            </Link>
          </div>
        </section>
        <section className={styles.bottomBar}>
          <div className={styles.headerContents}>
            <div className={styles.mobileButtonContainer}>
              <HeaderCartButton className={styles.mobileCartLink} />
              <div
                className={`${styles.mobileMenuButton} link`}
                onClick={() => setNavOpen(!isNavOpen)}
              >
                <MenuIcon />
              </div>
            </div>
            <nav className={isNavOpen ? styles.open : undefined}>
              {globalNav.map((item, i) => (
                <Link key={`top-nav-${i}`} href={item.route}>
                  {item.label}
                </Link>
              ))}
              <HeaderCartButton />
            </nav>
          </div>
        </section>
      </header>

      <main>{children}</main>

      <GlobalFooter />
      <BackToTopButton />
    </div>
  )
}
