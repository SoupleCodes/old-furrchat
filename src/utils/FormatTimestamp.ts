/**
 * Converts a Unix timestamp into a formatted date string.
 * @param timestamp - The Unix timestamp to be formatted, given in seconds.
 * @returns A string representing the formatted date and time.
 */

export function formatTimestamp(timestamp: number): string {
  if (!timestamp) {
    return '';
  }
  
  // Convert the Unix timestamp from seconds to milliseconds
  const realDate = new Date(timestamp * 1000);
  
  // Format the date into a readable string using locale-specific options
  const formattedDate = realDate.toLocaleString('en-US', {
      weekday: 'long',       // Full name of the day of the week (e.g., 'Monday')
      year: 'numeric',       // Full numeric year (e.g., '2024')
      month: 'long',         // Full name of the month (e.g., 'July')
      day: 'numeric',        // Day of the month as a number (e.g., '17')
      hour: 'numeric',       // Hour of the day in numeric format (e.g., '10 AM')
      minute: 'numeric',     // Minute of the hour in numeric format (e.g., '30')
      second: 'numeric',     // Second of the minute in numeric format (e.g., '45')
      timeZoneName: 'short'  // Short name of the time zone (e.g., 'PDT')
  });
  
  // Return the formatted date string
  return formattedDate;
}
