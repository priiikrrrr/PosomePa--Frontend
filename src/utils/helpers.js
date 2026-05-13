const SOCIAL_MEDIA_REGEX = /ig|wa|wp|tg|sc|tt|fb|x\b|yt/i;

export function checkSocialMedia(text) {
  return SOCIAL_MEDIA_REGEX.test(text);
}

export function formatTimeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0)
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatDateLabel(date) {
  const d = new Date(date);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isThreadClosed(message) {
  if (!message.closedAt) return false;
  return new Date() > new Date(message.closedAt);
}

export function getTimeRemaining(closedAt) {
  if (!closedAt) return null;
  const now = new Date();
  const closeTime = new Date(closedAt);
  const diff = closeTime - now;
  if (diff <= 0) return null;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m left`;
  }
  return `${minutes}m left`;
}
