// timeAgo.js

export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now - past) / 1000; // difference in seconds

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2592000; // approx 30 days
  const secondsInYear = 31536000;

  if (diff < secondsInMinute) {
    return `${Math.floor(diff)}s ago`;
  } else if (diff < secondsInHour) {
    return `${Math.floor(diff / secondsInMinute)}m ago`;
  } else if (diff < secondsInDay) {
    return `${Math.floor(diff / secondsInHour)}h ago`;
  } else if (diff < secondsInWeek) {
    return `${Math.floor(diff / secondsInDay)}d ago`;
  } else if (diff < secondsInMonth) {
    return `${Math.floor(diff / secondsInWeek)}w ago`;
  } else if (diff < secondsInYear) {
    return `${Math.floor(diff / secondsInMonth)}mo ago`;
  } else {
    return `${Math.floor(diff / secondsInYear)}y ago`;
  }
}
