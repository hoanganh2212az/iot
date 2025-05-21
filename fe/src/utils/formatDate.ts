import dayjs from 'dayjs';

/**
 * Format timestamp to "HH:mm:ss DD/MM/YYYY"
 * @param dateString ISO format string
 */
export function formatTimestamp(dateString: string): string {
  return dayjs(dateString).format('HH:mm:ss DD/MM/YYYY');
}
