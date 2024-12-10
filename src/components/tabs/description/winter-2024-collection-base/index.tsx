import { useMemo } from 'react'

import { SectionHeader } from '@/components/pageHeaders/section'
import { Toc } from '@/components/toc'

import styles from './styles.module.scss'

import { AboutIcon } from './AboutIcon'
import { DesignCard } from './DesignCard'
import { DesignIcon } from './DesignIcon'
import { CollectionSectionCard } from './collectionSectionCard'
import { CustomizationIcon } from '@/app/product/[slug]/icons/CustomizationIcon'

type Props = {
  currentItemName: string
}

export default function Winter2024CollectionBaseDesc({
  currentItemName,
}: Props) {
  const misprintMessage = useMemo(() => {
    if (currentItemName !== 'keychain') return null
    return (
      <p>
        <b>Note:</b> Due to a misprint in this design, it is now 50% off. (Or
        more with volume discounts!)
      </p>
    )
  }, [currentItemName])

  return (
    <div className={styles.wrapper}>
      <SectionHeader text="About" icon={<AboutIcon />} id="about" />
      <p>
        This preorder page is inspired by the layout of Kickstarter campaigns,
        but with the freedom to make this as perfectly structured and customized
        as desired; below is a sample custom component that both advertises the
        other items in this collection, and allows for easier browsing as well.
      </p>

      <section className={styles.collectionSection}>
        <CollectionSectionCard
          cardItemName="Large Decoration"
          cardItemSlug="a"
          currentItemName={currentItemName}
        />
        <CollectionSectionCard
          cardItemName="Small Decoration"
          cardItemSlug="b"
          currentItemName={currentItemName}
        />
        <CollectionSectionCard
          cardItemName="Necklace"
          cardItemSlug="c"
          currentItemName={currentItemName}
        />
      </section>

      <SectionHeader text="Designs" icon={<DesignIcon />} id="designs" />

      <p>
        For preorder items where the physical product may not have been
        completed yet, large design images and clear descriptions are essential.
      </p>

      <p>
        For the sake of making an easier sample, each design here is just
        labelled as a different colour, but in a real site there can be
        different shapes, gloss effects, etc. depending on what the item is.
      </p>

      <section className={styles.designCardContainer}>
        <DesignCard
          imageName="red"
          number={1}
          title="Red"
          frontText="Description of the front side of this decoration"
          backText="Description of the back side of this decoration"
        />
        <DesignCard
          imageName="green"
          number={2}
          title="Green"
          frontText="Wow it's so cool"
          backText="Amazing product, buy it"
        />
        {misprintMessage}
        <DesignCard
          imageName="blue"
          number={3}
          title="Blue"
          frontText="Incredible"
          backText="More descriptions"
        />
        <DesignCard
          imageName="purple"
          number={4}
          title="Purple"
          frontText={
            <span>
              <i>JSX</i> can be used within these <u>descriptions</u> as well!
            </span>
          }
          backText="(The text styling above makes no semantic sense--it's just to show off the JSX capabilities)"
        />
        {misprintMessage}
        <DesignCard
          imageName="silver"
          title="Silver"
          number={5}
          frontText="Shiny"
          backText="Shiny"
        />
        <DesignCard
          imageName="gold"
          title="Gold"
          number={6}
          frontText="Even more shiny"
          backText="Very shiny"
        />
      </section>

      <SectionHeader
        text="Customizations"
        icon={<CustomizationIcon />}
        id="customizations"
      />

      <section className={styles.designCardContainer}>
        <DesignCard
          title="Custom message"
          number={1}
          imageName="customMessage"
          frontText="Add a custom name and message to the decoration!"
          backText="Short messages only, but the font size will be adjusted to fit slightly longer ones."
          isSpecial
        />
        <DesignCard
          title="Custom image"
          number={2}
          imageName="customImage"
          frontText="Emboss a custom image into this ornament!"
          backText="Slots are quite limited for this one!"
          isSpecial
        />
        <DesignCard
          title="Custom design"
          number={3}
          imageName="customDesign"
          frontText="Get an ornament of your very own design!"
          backText={
            <span>
              This was available during only the first week of the preorder, and
              is now over.
            </span>
          }
          isSpecial
        />
      </section>
      <Toc
        items={[
          { id: 'about', name: 'About', icon: <AboutIcon /> },
          { id: 'designs', name: 'Designs', icon: <DesignIcon /> },
          { id: 'red', name: 'Red', level: 1 },
          { id: 'green', name: 'Green', level: 1 },
          { id: 'blue', name: 'Blue', level: 1 },
          { id: 'purple', name: 'Purple', level: 1 },
          { id: 'silver', name: 'Silver', level: 1 },
          {
            id: 'gold',
            name: 'Gold',
            level: 1,
            isLastItemInSubLevel: true,
          },
          {
            id: 'customizations',
            name: 'Customizations',
            icon: <CustomizationIcon strokeWidth={0.05} />,
          },
          { id: 'customMessage', name: 'Message', level: 1 },
          { id: 'customImage', name: 'Image', level: 1 },
          { id: 'customDesign', name: 'Design', level: 1 },
        ]}
      />
    </div>
  )
}
