export function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return 'Invalid timestamp';

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid timestamp';

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
