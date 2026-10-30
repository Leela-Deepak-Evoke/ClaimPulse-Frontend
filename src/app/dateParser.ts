import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const DATE_DISPLAY_FORMAT = 'MMM D, YYYY'

const ACCEPTED_FORMATS = [DATE_DISPLAY_FORMAT, 'MMMM D, YYYY', 'YYYY-MM-DD', 'M/D/YYYY']

/** Turns typed text into a YYYY-MM-DD string, or null when it is not a real date. */
export function parseTypedDate(input: string): string | null {
  const text = input.trim()
  for (const format of ACCEPTED_FORMATS) {
    const parsed = dayjs(text, format, true)
    if (parsed.isValid()) return parsed.format('YYYY-MM-DD')
  }
  return null
}
