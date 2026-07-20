import { I18nProvider } from '@/lib/i18n-provider'
import ruMessages from '@/messages/ru.json'

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider locale="ru" messages={ruMessages}>{children}</I18nProvider>
}
