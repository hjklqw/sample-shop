import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

export const productDescriptionComponents: { [slug: string]: ComponentType } = {
  'amazing-decoration-a': dynamic(() => import('./amazing-decoration-a')),
  'amazing-decoration-b': dynamic(() => import('./amazing-decoration-b')),
  'amazing-decoration-c': dynamic(() => import('./amazing-decoration-c')),
  'autumn-bling': dynamic(() => import('./autumn-bling')),
  'shiny-pot': dynamic(() => import('./shiny-pot')),
}
