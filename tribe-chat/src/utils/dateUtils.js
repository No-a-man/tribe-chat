/**
 * Formats a date string into relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time
 */
export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) {
    return 'just now';
  }
  
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Formats a date for message grouping (e.g., "Today", "Yesterday")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date label
 */
export function formatGroupDate(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Formats time for message timestamp (e.g., "2:30 PM")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time
 */
export function formatMessageTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
}