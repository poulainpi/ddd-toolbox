import { useEffect } from 'react'
import { useT } from '@ddd-toolbox/i18n'
import type { MessageKey } from '@ddd-toolbox/i18n'

export interface LocaleMetaProps {
  titleKey: MessageKey
  descriptionKey: MessageKey
}

/**
 * Keeps document.title and the meta description in sync with the selected UI
 * language. Static SEO tags stay English; this only affects the running page.
 */
export function LocaleMeta({ titleKey, descriptionKey }: LocaleMetaProps) {
  const t = useT()

  useEffect(() => {
    document.title = t(titleKey)
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t(descriptionKey))
  }, [t, titleKey, descriptionKey])

  return null
}
