import { useCallback, useMemo } from 'react'

import { NoteIcon } from '../icons/NoteIcon'

import {
  ProductTimelineEntry,
  ProductTimelineEventType,
} from '@/models/db/product'

import { SectionHeader } from '@/components/pageHeaders/section'

import styles from './styles.module.scss'

import { PRODUCTION_EVENT_NAME, TimelineEntry } from './entry'

type Props = {
  timeline: ProductTimelineEntry[]
}

export const TimelineTab = ({ timeline }: Props) => {
  const endOfCampaignIndex = timeline.findIndex(
    (entry) => entry.eventType === ProductTimelineEventType.END
  )
  const preProductionTimeline = timeline.slice(0, endOfCampaignIndex + 1)
  const restOfTimeline = timeline.slice(endOfCampaignIndex + 1)

  const today = useMemo(() => new Date(), [])

  const renderTimeline = useCallback(
    (segment: ProductTimelineEntry[], lastDate?: Date) => {
      return (
        <section>
          <div className={styles.bar} />
          <div className={styles.entries}>
            {segment.map((entry, i) => {
              const nextDate =
                i < segment.length - 1
                  ? new Date(segment[i + 1].date)
                  : lastDate
              return (
                <TimelineEntry
                  key={i}
                  today={today}
                  entry={entry}
                  nextEntryDate={nextDate}
                />
              )
            })}
          </div>
        </section>
      )
    },
    [today]
  )

  return (
    <>
      <p>
        The estimated timeline for this preorder. The rocket&apos;s position
        will be updated to match the current stage!
      </p>
      <div className={styles.timeline}>
        {renderTimeline(
          preProductionTimeline,
          timeline[endOfCampaignIndex + 1].date
        )}
        <section className={styles.productionSection}>
          <div className={styles.bar} />
          <div className={styles.entries}>
            <TimelineEntry
              today={today}
              entry={{
                date: timeline[endOfCampaignIndex + 1].date,
                dateDisplay: '',
                event: PRODUCTION_EVENT_NAME,
                eventType: ProductTimelineEventType.PRODUCTION,
              }}
              nextEntryDate={restOfTimeline[0].date}
            />
          </div>
        </section>
        {renderTimeline(restOfTimeline)}
      </div>
      <SectionHeader text="Note" icon={<NoteIcon />} simple />
      <p>
        There may be delays in production, shipping, or other unconsidered
        issues that could cause estimates to become inaccurate. I will do my
        best to ensure that everything is properly fulfilled in a timely manner,
        and will notify everyone immediately if anything is to change.
      </p>
    </>
  )
}
