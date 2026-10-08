const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseMonthYear(value: string | null) {
  const match = value?.trim().match(/^([a-z]+)\s+(\d{4})$/i)
  if (!match) return null

  const month = months.findIndex((name) =>
    [name.toLowerCase(), name.slice(0, 3).toLowerCase()].includes(match[1].toLowerCase()),
  )
  if (month === -1) return null

  const year = Number(match[2])
  return { label: `${months[month].slice(0, 3)} ${year}`, totalMonths: year * 12 + month }
}

export function getExperiencePeriod(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean,
  now = new Date(),
) {
  const start = parseMonthYear(startDate)
  const current = isCurrent || endDate?.trim().toLowerCase() === 'present'
  const end = parseMonthYear(endDate)
  // Roles use calendar months in the portfolio owner's timezone, without guessing a day.
  const currentParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Bangkok', year: 'numeric', month: 'numeric',
  }).formatToParts(now)
  const currentYear = Number(currentParts.find((part) => part.type === 'year')?.value)
  const currentMonth = Number(currentParts.find((part) => part.type === 'month')?.value) - 1
  const endMonths = current ? currentYear * 12 + currentMonth : end?.totalMonths
  let duration: string | null = null

  if (start && endMonths !== undefined && endMonths >= start.totalMonths) {
    const totalMonths = endMonths - start.totalMonths
    const years = Math.floor(totalMonths / 12)
    const remainingMonths = totalMonths % 12
    const parts = []
    if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
    if (remainingMonths || !years) {
      parts.push(`${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`)
    }
    duration = parts.join(' ')
  }

  return {
    startDate: start?.label ?? startDate,
    endDate: current ? 'Present' : end?.label ?? endDate,
    isCurrent: current,
    duration,
  }
}
