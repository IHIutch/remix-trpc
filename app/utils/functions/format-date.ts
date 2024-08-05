import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export function formatDate(val: Date, format = 'MM/DD/YYYY') {
  return dayjs(val).format(format)
}

export function formatDateFromNow(val: Date) {
  return dayjs(val).fromNow()
}
