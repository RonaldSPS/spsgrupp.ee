import { I18nProvider } from '@/lib/i18n-provider'
import enMessages from '@/messages/en.json'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider locale="en" messages={enMessages}>{children}</I18nProvider>
}
