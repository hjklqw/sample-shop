import { PageLayout } from '@/components/layouts/page'

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
