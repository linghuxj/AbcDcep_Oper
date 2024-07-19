import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import arLocale from 'element-ui/lib/locale/lang/ar'
export default function loadMessages() {
  const locales = require.context(
    './messages',
    true,
    /[A-Za-z0-9-_,\s]+\.js$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      const value = locales(key).default
      if (locale === 'en') {
        messages[locale] = { ...value, ...enLocale }
      } else if (locale === 'zh') {
        messages[locale] = { ...value, ...zhLocale }
      } else if (locale === 'ar') {
        messages[locale] = { ...value, ...arLocale }
      }
    }
  })
  return messages
}
