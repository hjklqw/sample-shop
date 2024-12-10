import { SVGProps } from 'react'

/** An HOC that automatically creates an SVG component with the correct properties, accepting further SVG props. */
export function asIcon(
  path: React.ReactNode,
  extraSvgProps?: SVGProps<SVGSVGElement>
) {
  const iconComponent = (props?: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      stroke="currentcolor"
      fill="currentcolor"
      {...extraSvgProps}
      {...props}
    >
      {path}
    </svg>
  )
  return iconComponent
}
