/** Kiirtest: gbp-calendar loader + nädalamatemaatika. node --import tsx … */
import { loadGbpCalendar, getGbpWeekTasks } from "../lib/reporting/gbp-calendar"

async function main() {
  const cal = await loadGbpCalendar()
  if (!cal) {
    console.log("calendar NULL")
    process.exit(1)
  }
  console.log("kalender ok:", cal.weeks.length, "nädalat; püsitoimetusi:", cal.standingTasks.length)
  for (const d of ["2026-10-23T06:00:00Z", "2026-11-13T06:00:00Z", "2027-01-20T06:00:00Z"]) {
    const t = getGbpWeekTasks(new Date(d), cal)
    console.log(d.slice(0, 10), "->", t.weekStart, "|", t.week.theme, "| rotated:", t.rotated, "| foto:", t.week.photoTask ? "jah" : "-")
  }
  process.exit(0)
}
main()
