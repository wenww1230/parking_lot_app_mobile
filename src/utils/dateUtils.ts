export function getPeruLimaNow(): string {
  const now = new Date();
  const parts = now.toLocaleString('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const [datePart, timePart] = parts.split(', ');
  return `${datePart} ${timePart}`;
}
