// small helpers shared by VideoCard, Watch, Dashboard ...

export function formatViews(number = 0) {
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M views`;

  if (number >= 1000) return `${Math.floor(number / 1000)}K views`;

  return `${number} ${number === 1 ? "view" : "views"}`;
}

export function formatCount(number = 0) {
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;

  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;

  return `${number}`;
}

export function formatDuration(totalSeconds = 0) {
  // Cloudinary can send decimals (e.g. 65.4) -> always work with whole seconds
  const seconds = Math.max(0, Math.round(totalSeconds));

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${remainingSeconds}`;
  }

  return `${minutes}:${remainingSeconds}`;
}

// how long ago something was uploaded
export function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mon ago`;

  return `${Math.floor(days / 365)} yr ago`;
}
