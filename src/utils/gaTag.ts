export const ID = process.env.NEXT_PUBLIC_GA_ID!

export const installationScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ID}', {
  page_path: window.location.pathname,
});`

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url: string) {
  window.gtag('config', ID, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(
  action: string,
  params: { category: string; label: string; value?: string }
) {
  window.gtag('event', action, {
    event_category: params.category,
    event_label: params.label,
    value: params.value,
  })
}
