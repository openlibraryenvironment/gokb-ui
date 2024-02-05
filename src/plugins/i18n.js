import { createI18n } from 'vue-i18n'
import en from '../locales/en.json' assert { type: 'json' };
import de from '../locales/de.json' assert { type: 'json' };

function loadLocaleMessages () {
  const messages = {
    en: en,
    de: de
  }

  return messages
}

const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  },
  de: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  }
}

const i18n = createI18n({
  dateTimeFormats,
  locale: import.meta.env.VITE_I18N_LOCALE || navigator.language.split('-')[0],
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

export default i18n