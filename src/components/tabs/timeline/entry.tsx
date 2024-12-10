import Image from 'next/image'

import {
  ProductTimelineEntry,
  ProductTimelineEventType,
} from '@/models/db/product'

import styles from './styles.module.scss'

import finishIcon from './icons/finish.png'
import productionBg from './icons/productionBg.png'
import rocketIcon from './icons/rocket.png'
import shipmentIcon from './icons/shipment.png'

export const PRODUCTION_EVENT_NAME = '(Production)'

type RocketIconProps = {
  top: number
}

const RocketIcon = ({ top }: RocketIconProps) => (
  <Image
    src={rocketIcon}
    alt="Current position"
    width={65}
    height={65}
    className={styles.rocketIcon}
    style={{ top }}
  />
)

type Props = {
  today: Date
  entry: ProductTimelineEntry
  nextEntryDate?: Date
}

export const TimelineEntry = ({ today, entry, nextEntryDate }: Props) => {
  const date = new Date(entry.date)
  return (
    <div className={`${styles.entry} ${styles[entry.eventType]}`}>
      {today >= date &&
        (nextEntryDate === undefined || today < nextEntryDate) && (
          <RocketIcon top={entry.event === PRODUCTION_EVENT_NAME ? -22 : -20} />
        )}
      <div className={styles.date}>
        <span>
          {entry.eventType === ProductTimelineEventType.END && (
            <Image
              src={finishIcon}
              alt=""
              width={60}
              height={50}
              className={styles.eventIcon}
            />
          )}
          {entry.eventType === ProductTimelineEventType.SHIPMENT && (
            <Image
              src={shipmentIcon}
              alt=""
              width={50}
              height={50}
              className={styles.eventIcon}
            />
          )}
          <span>{entry.dateDisplay}</span>
        </span>
      </div>
      <div className={styles.notch} />
      <div className={styles.desc}>
        {entry.eventType === ProductTimelineEventType.PRODUCTION && (
          <Image src={productionBg} alt="" width={150} height={64} />
        )}
        <span className={styles.mainEvent}>{entry.event}</span>
        {entry.subEvent && (
          <span className={styles.subEvent}>{entry.subEvent}</span>
        )}
      </div>
    </div>
  )
}
