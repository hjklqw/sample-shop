import type { Metadata } from 'next'
import { Amatic_SC, Comfortaa } from 'next/font/google'
import Script from 'next/script'

import * as gaTag from '@/utils/gaTag'

import { GlobalLayout } from '@/components/layouts/global'

import '@/assets/globals.scss'
import { StateContextProvider } from '@/state/StateContextProvider'

const font = Comfortaa({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
})
const headerFont = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-header',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_HOST!),
  title: {
    template: '%s | Shop Sample',
    default: 'SHOP | Sample',
  },
  description: 'A sample shop site written in React and Next.js',
  creator: 'Michelle Poon',
  keywords: ['Sample', 'Shop', 'Portfolio', 'E-commerce', 'React', 'Next.js'],
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    images: ['/ograph.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaTag.ID}`}
        />
        <Script
          id="gtag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: gaTag.installationScript,
          }}
        />
      </head>

      <body className={`${font.variable} ${headerFont.variable}`}>
        <StateContextProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </StateContextProvider>
      </body>
    </html>
  )
}
